import { Role, AuditLogEvent, PermissionsBitField } from 'discord.js';
import { Event, Navi, ClientLogger } from '../../structures/index.js';
import { Servers, logType } from '../../database/index.js';


export default class RoleUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "roleUpdate",
        });
    }
    public async run(oldRole: Role, newRole: Role): Promise<any> {
        try {
            const log = await Servers.getLogger(oldRole.guild.id, logType.RoleUpdate);
            if (!log) return;
            const audit = await oldRole.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 1 });
            const entry = audit.entries.first();
            let user = await this.client.users.fetch(entry.executor.id);

            let icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            if (oldRole.name !== newRole.name) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Name Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Name", value: `\`${oldRole.name}\``, inline: true },
                        { name: "New Name", value: `\`${newRole.name}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldRole.color !== newRole.color) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Color Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Color", value: `\`#${oldRole.color.toString(16)}\``, inline: true },
                        { name: "New Color", value: `\`#${newRole.color.toString(16)}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldRole.hoist !== newRole.hoist) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Hoist Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Hoist", value: `\`${oldRole.hoist}\``, inline: true },
                        { name: "New Hoist", value: `\`${newRole.hoist}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldRole.mentionable !== newRole.mentionable) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Mentionable Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Mentionable", value: `\`${oldRole.mentionable}\``, inline: true },
                        { name: "New Mentionable", value: `\`${newRole.mentionable}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Permissions Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Permissions", value: `\`${new PermissionsBitField(oldRole.permissions.bitfield).toArray().join(", ") || "None"}\``, inline: true },
                        { name: "New Permissions", value: `\`${new PermissionsBitField(newRole.permissions.bitfield).toArray().join(", ") || "None"}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldRole.rawPosition !== newRole.rawPosition) {
                const embed = this.client.embed()
                    .setAuthor({ name: user.tag, iconURL: icon })
                    .setTitle(`${this.client.emo.update} Role Position Updated`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: "Role", value: `<@&${oldRole.id}> (\`${oldRole.id}\`)`, inline: true },
                        { name: "Old Position", value: `\`${oldRole.rawPosition}\``, inline: true },
                        { name: "New Position", value: `\`${newRole.rawPosition}\``, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();

                await ClientLogger.sendWebhook(this.client, oldRole.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

        } catch (err) {
            if (err) return;
        }
    }
}