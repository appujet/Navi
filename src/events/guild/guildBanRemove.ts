import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { GuildBan, AuditLogEvent } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class GuildBanRemove extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "guildBanRemove",
        });
    }
    public async run(ban: GuildBan): Promise<any> {
        try {
            if (ban.user.partial) await ban.user.fetch();
        } catch (err: any) {
            if (['Missing Permissions', 'Missing Access'].includes(err.message)) return;
            return this.client.logger.error(`Error fetching ban: ${err.message}`);
        }
        const log = await Servers.getLogger(ban.guild.id, logType.MemberUnban);

        if (!log) return;

        const audit = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 });
        const entry = audit.entries.first();
        const user = await this.client.users.fetch(entry.executor.id);

        const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

        const embed = this.client.embed()
            .setAuthor({ name: user.tag, iconURL: icon })
            .setTitle(`${this.client.emo.ban} Member Unbanned`)
            .setColor(log.color ? log.color : this.client.color.red)
            .addFields(
                { name: "Member", value: `<@${ban.user.id}> (\`${ban.user.id}\`)`, inline: true },
            )
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            .setTimestamp();
        await ClientLogger.sendWebhook(this.client, ban.guild.id, log.textId, {
            embeds: [embed]
        });
    }
}