import { Event, Navi, Canvas, ClientLogger } from "../../structures/index.js";
import { GuildMember, TextChannel, Role, PartialGuildMember } from "discord.js";
import { Servers, logType } from "../../database/index.js";



export default class UserUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "userUpdate",
        });
    }
    public async run(oldUser: GuildMember | PartialGuildMember | any, newUser: GuildMember | any): Promise<any> {
        if (oldUser.id === this.client.user.id) return
        if (oldUser.partial) { await oldUser.fetch(); }

        if (oldUser.partial) return;
        let log: any = null;
        let guilds: any = null;
        this.client.guilds.cache.forEach(async guild => {
            guild.members.cache.forEach(async (member, memberid) => {
                if (newUser.id === memberid) {
                    guilds = member.guild;
                }
            })
        })
        if (oldUser.avatar !== newUser.avatar) {
            log = await Servers.getLogger(guilds.id, logType.MemberAvatarUpdate)
            let newIcon = `https://cdn.discordapp.com/avatars/${newUser.id}/${newUser.avatar}.png` as any;
            let oldIcon = `https://cdn.discordapp.com/avatars/${oldUser.id}/${oldUser.avatar}.png` as any;

            if (!log) return;
            const file = await Canvas.mergeImages(oldIcon, newIcon);
            const embed = this.client.embed()
                .setAuthor({ name: newUser.tag, iconURL: newUser.avatarURL({}) })
                .setTitle(`${this.client.emo.update} Member Avatar Changed`)
                .setDescription(`User avatar changed: [Old Avatar](${oldIcon}) | [New Avatar](${newIcon})`)
                .setColor(log.color ? log.color : this.client.color.blue)
                .setImage(`attachment://image.png`)
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp()
            await ClientLogger.sendWebhook(this.client, guilds.id, log.textId, {
                embeds: [embed],
                files: [file]
            });
        }
        if (oldUser.username !== newUser.username) {
            log = await Servers.getLogger(guilds.id, logType.MemberUsernameUpdate)
            if (!log) return;
            const embed = this.client.embed()
                .setAuthor({ name: newUser.user.tag, iconURL: newUser.avatarURL({}) })
                .setTitle(`${this.client.emo.update} Member Username Changed`)
                .setDescription(`User username changed: **${oldUser.username}** | **${newUser.username}**`)
                .addFields(
                    { name: "Member", value: `<@${newUser.id}> \`(${newUser.id})\``, inline: true },

                )
                .setColor(log.color ? log.color : this.client.color.blue)
                .setTimestamp()
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            await ClientLogger.sendWebhook(this.client, guilds.id, log.textId, {
                embeds: [embed]
            });
        }

    }
}