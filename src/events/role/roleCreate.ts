import { Role, AuditLogEvent } from "discord.js";
import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";


export default class RoleCreate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "roleCreate",
        });
    }

    public async run(role: Role): Promise<any> {
        try {
            const log = await Servers.getLogger(role.guild.id, logType.RoleCreate);
            if (!log) return;
            const audit = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 1 });
            const entry = audit.entries.first();
            let user = await this.client.users.fetch(entry.executor.id);

            let icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            const embed = this.client.embed()
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.create} Role Created`)
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: "Role", value: `<@&${role.id}> (\`${role.id}\`)`, inline: true },
                    { name: "Role Color", value: `\`#${role.color.toString(16)}\``, inline: true },
                    { name: "Role Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
                    { name: "Role Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
                    { name: "Role Permissions", value: role.permissions.toArray().join(", ") ? role.permissions.toArray().join(", ") : "None", inline: true },
                    { name: "Created Time", value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R> (<t:${Math.floor(role.createdTimestamp / 1000)}>)`, inline: true }
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp();

            await ClientLogger.sendWebhook(this.client, role.guild.id, log.textId, {
                embeds: [embed]
            });
        } catch (err) {
            if (err) return;
        }
    }
}