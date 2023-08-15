import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { GuildChannel, AuditLogEvent } from "discord.js";
import { Servers, logType } from "../../database/index.js";

export default class ChannelCreate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "channelCreate",
        });
    }
    public async run(channel: GuildChannel): Promise<any> {
        try {
            const log = await Servers.getLogger(channel.guildId, logType.ChannelCreate);
            if (!log) return;
            const { name } = channel;
            const regEx = /^🟢｜ticket([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?$/i;
            if (regEx.test(name)) return;

            const audit = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 });
            const entry = audit.entries.first();
            const user = await this.client.users.fetch(entry.executor.id);
            const cnType = {
                0: 'Text Channel',
                2: 'Voice Channel',
                4: 'Category',
                13: 'Stage Channel',
                5: 'Announcement Channel',
                14: 'Directory Channel',
                15: 'Forum Channel',
                12: 'Private Thread Channel',
                11: 'Public Thread Channel',
                10: 'News Thread Channel',
            }
            const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            const embed = this.client.embed()
                .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                .setDescription(`${this.client.emo.create} ${cnType[channel.type]} Created **${channel.name}**`)
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: 'Channel', value: `${channel.toString()} \`${channel.id.toString()}\``, inline: true },
                    { name: 'Created Time', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(channel.createdTimestamp / 1000)}>)`, inline: true },

                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp();
            await ClientLogger.sendWebhook(this.client, channel.guildId, log.textId, {
                embeds: [embed]
            });
        } catch (e) {
            if (e) return;
        }
    }
}