import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Message, ChannelType } from "discord.js";
import { Servers, logType } from "../../database/index.js";



export default class MessageUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "messageUpdate",
        });
    }
    public async run(oldMessage: Message, newMessage: Message): Promise<any> {
        try {
            if (oldMessage?.author?.bot) return;
            if (oldMessage.channel.type === ChannelType.DM) return;
            const log = await Servers.getLogger(oldMessage.guildId, logType.MessageEdit);
            if (!log) return;
            if (oldMessage.content === newMessage.content) return;

            const embed = this.client.embed()
                .setColor(log.color ? log.color : this.client.color.red)
                .setAuthor({ name: oldMessage.author?.tag, iconURL: oldMessage.author?.displayAvatarURL({}) })
                .setTitle(`${this.client.emo.edit} Message Edited`)
                .setDescription(`**Before:**\n\`\`\`${oldMessage.content.length > 1024 ? oldMessage.content.slice(0, 1024) + "..." : oldMessage.content}\`\`\`\n**After:**\n\`\`\`${newMessage.content.length > 1024 ? newMessage.content.slice(0, 1024) + "..." : newMessage.content}\`\`\``)
                .addFields(
                    { name: "Member", value: `<@${oldMessage.author.id}> \`(${oldMessage.author.id})\``, inline: true },
                    { name: "Channel", value: `<#${oldMessage.channelId}> \`(${oldMessage.channelId})\``, inline: true },
                    { name: "Message Time", value: `<t:${Math.floor(oldMessage.createdTimestamp / 1000)}:R> - (<t:${Math.floor(oldMessage.createdTimestamp / 1000)}>)`, inline: false },
                    { name: "Edited Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                )
                .setFooter({ text: `Message ID: ${oldMessage.id}`, iconURL: this.client.user.displayAvatarURL({}) })

            if (oldMessage.attachments.size > 0) {
                const attachment = oldMessage.attachments.first();
                if (attachment) {
                    embed.setImage(attachment.url);
                }
            }
            await ClientLogger.sendWebhook(this.client, oldMessage.guildId, log.textId, {
                embeds: [embed]
            });
        } catch (error) {
            if (error) return;
        }

    }
}