import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { AuditLogEvent, ChannelType, TextChannel, NewsChannel, DMChannel, PartialDMChannel } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class ChannelPinsUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "channelPinsUpdate",
        });
    }

    public async run(channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date): Promise<any> {
        try {

            if (channel.type === ChannelType.DM) return;
            const log = await Servers.getLogger(channel.guildId, logType.ChannelPinsUpdate);
            if (!log) return;
            const { name } = channel;

            const regEx = /^🟢｜ticket([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?$/i;
            if (regEx.test(name)) return;

            const massage = await channel.messages.fetch(channel.lastMessageId);
            const audit = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.MessagePin, limit: 1 });
            const entry = audit.entries.first();

            const user = await this.client.users.fetch(entry.executor.id);
            const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            const embed = this.client.embed()
                .setColor(log.color ? log.color : this.client.color.red)
                .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                .setDescription(`${this.client.emo.pin} Pins Updated in **${channel.name}**`)
                .addFields(
                    { name: 'Channel', value: `${channel.toString()} \`${channel.id.toString()}\``, inline: true },
                    { name: 'Message', value: `[Jump to Message](${massage.url})`, inline: true },
                    { name: 'Message By', value: `${massage.author.toString()} \`${massage.author.id.toString()}\``, inline: true },
                    { name: 'Pinned Time', value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: true },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

            await ClientLogger.sendWebhook(this.client, channel.guildId, log.textId, {
                embeds: [embed]
            });
        } catch (error) {
            if (error) return;
        }
    }
}