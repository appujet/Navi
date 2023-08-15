import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { GuildMember, PartialGuildMember, AuditLogEvent } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class GuildMemberUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "guildMemberUpdate",
        });
    }
    public async run(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember): Promise<any> {
        if (oldMember.user.id === this.client.user.id) return
        if (oldMember.partial) return;
        const audit = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 1 });
        const entry = audit.entries.first();

        const user = await this.client.users.fetch(entry.executor.id);
        const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;


        const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
        const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));
        if (rolesAdded.size > 0) {
            const log = await Servers.getLogger(newMember.guild.id, logType.MemberRoleAdd);
            if (!log) return;
            const roleAddedString = [];
            for (const role of [...rolesAdded.values()]) {
                roleAddedString.push(role.id.toString());
            }
            const embed = this.client.embed()
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.addUser} Member Role Added`)
                .setColor(log.color ? log.color : this.client.color.green)
                .addFields(
                    { name: "Member", value: `<@${newMember.id}>(\`${newMember.id}\`)`, inline: true },
                    { name: "Role(s)", value: `<@&${roleAddedString.join("> , <@&")}>(\`${roleAddedString.join(", ")}\`)`, inline: true },
                    { name: "Added Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>(<t:${Math.floor(Date.now() / 1000)}>)`, inline: true },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            await ClientLogger.sendWebhook(this.client, oldMember.guild.id, log.textId, {
                embeds: [embed]
            });

        }
        if (rolesRemoved.size > 0) {
            const log = await Servers.getLogger(newMember.guild.id, logType.MemberRoleRemove);
            if (!log) return;
            const roleRemovedString = [];
            for (const role of [...rolesRemoved.values()]) {
                roleRemovedString.push(role.id.toString());
            }
            const embed = this.client.embed()
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.removeUser} Member Role Removed`)
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: "Member", value: `<@${newMember.id}>(\`${newMember.id}\`)`, inline: true },
                    { name: "Role(s)", value: `<@&${roleRemovedString.join("> , <@&")}>(\`${roleRemovedString.join(", ")}\`)`, inline: true },
                    { name: "Removed Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>(<t:${Math.floor(Date.now() / 1000)}>)`, inline: true },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            await ClientLogger.sendWebhook(this.client, oldMember.guild.id, log.textId, {
                embeds: [embed]
            });
        }
        if (oldMember.nickname !== newMember.nickname) {
            const log = await Servers.getLogger(newMember.guild.id, logType.MembersNicknameUpdate);
            if (!log) return;

            const embed = this.client.embed()
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.edit} Member Nickname Changed`)
                .setDescription(`**Old Nickname:** ${oldMember.nickname ? oldMember.nickname : "None"}\n**New Nickname:** ${newMember.nickname ? newMember.nickname : "None"}`)
                .setColor(log.color ? log.color : this.client.color.blue)
                .addFields(
                    { name: "Member", value: `<@${newMember.id}>(\`${newMember.id}\`)`, inline: true },
                    { name: "Changed Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>(<t:${Math.floor(Date.now() / 1000)}>)`, inline: true },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            await ClientLogger.sendWebhook(this.client, oldMember.guild.id, log.textId, {
                embeds: [embed]
            });
        }
    }
}
