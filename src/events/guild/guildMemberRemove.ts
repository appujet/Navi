import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { GuildMember, TextChannel, Role, PartialGuildMember } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class GuildMemberRemove extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "guildMemberRemove",
        });
    }
    public async run(member: GuildMember | PartialGuildMember): Promise<any> {
        if (member.user.id === this.client.user.id) return
        if (member.partial) return;

        const log = await Servers.getLogger(member.guild.id, logType.MemberLeave);
        try {
            const ban = await member.guild.bans.fetch(member.id);
            if (ban) return;
        } catch (err) {
            if (!log) return;
            const embed = this.client.embed()
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({}) })
                .setTitle(`${this.client.emo.removeUser} Member Left`)
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: "Member", value: `<@${member.id}> (\`${member.id}\`)`, inline: true },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp();
            await ClientLogger.sendWebhook(this.client, member.guild.id, log.textId, {
                embeds: [embed]
            });
        }
    }
}