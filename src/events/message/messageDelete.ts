import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Message, ChannelType, AuditLogEvent, User } from 'discord.js';
import { Servers, logType } from "../../database/index.js";


export default class MessageDelete extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "messageDelete",
        });
    }
    public async run(message: Message): Promise<any> {
        try {
            if (message.author.bot) return;
            if (message.channel.type === ChannelType.DM) return;
            const log = await Servers.getLogger(message.guildId, logType.MessageDelete);
            if (!log) return;
            let user: User;
            let icon: string;
            try {
                const auditLog = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 10 });
                const entry = auditLog.entries.first();
                user = await this.client.users.fetch(entry.executor.id);
                if (user) icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            } catch (error) {

            }
            const embed = this.client.embed()
                .setColor(log.color ? log.color : this.client.color.red)
                
                .setTitle(`${this.client.emo.delete} Message Deleted`)
                .setDescription(`\`\`\`${message.content.length > 1024 ? message.content.slice(0, 1024) + "..." : message.content}\`\`\``)
                .addFields(
                    { name: "Member", value: `<@${message.author.id}> \`(${message.author.id})\``, inline: true },
                    { name: "Channel", value: `<#${message.channelId}> \`(${message.channelId})\``, inline: true },
                    { name: "Message Time", value: `<t:${Math.floor(message.createdTimestamp / 1000)}:R> - (<t:${Math.floor(message.createdTimestamp / 1000)}>)`, inline: false },
                    { name: "Deleted Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                )
                .setFooter({ text: `Message ID: ${message.id}`, iconURL: this.client.user.displayAvatarURL({}) })
            if (user) {
                embed.setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
            } else {
                embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({}) })
            }
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment) {
                    embed.setImage(attachment.url);
                }
            }
            await ClientLogger.sendWebhook(this.client, message.guildId, log.textId, {
                embeds: [embed]
            });
        } catch (error) {
            if (error) return;
            console.log(error);
        }
    }
}