import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";
import { ThreadMember } from "discord.js";


export default class ThreadMemberUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "threadMemberUpdate",
        });
    }
    public async run(oldMember: ThreadMember, newMember: ThreadMember): Promise<any> {

        try {
            const log = await Servers.getLogger(oldMember.thread.guild.id, logType.threadMemberUpdate);
            if (!log) return
            if (oldMember.joinedTimestamp != newMember.joinedTimestamp) {
                const embed = this.client.embed()
                    .setAuthor({ name: oldMember.thread.guild.name, iconURL: oldMember.thread.guild.iconURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setDescription(`${this.client.emo.update} **Thread member updated in ${oldMember.thread.toString()}**`)
                    .addFields(
                        { name: `Member`, value: `${oldMember}`, inline: true },
                        { name: `Joined Timestamp`, value: `<t:${Math.floor(oldMember.joinedTimestamp / 1000)}:R> - (<t:${Math.floor(oldMember.joinedTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldMember.thread.guildId, log.textId, {
                    embeds: [embed]
                });
            }
        } catch (error) {
            this.client.logger.error(error);
        }
    }
}