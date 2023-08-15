import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";
import { ThreadMember, Collection, Snowflake } from "discord.js";

export default class ThreadMembersUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "threadMembersUpdate",
        });
    }
    public async run(oldMembers: Collection<Snowflake, ThreadMember>, mewMembers: Collection<Snowflake, ThreadMember>): Promise<any> {

        try {
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
            const thread = oldMembers.first()?.thread ?? mewMembers.first()?.thread;
            const log = await Servers.getLogger(thread.guild.id, logType.threadMembersUpdate);
            if (!log) return
            if (oldMembers.size != mewMembers.size) {
                const memberAdded = mewMembers.filter(x => !oldMembers.get(x.id));
                const memberRemoved = oldMembers.filter(x => !mewMembers.get(x.id));
                if (memberAdded.size != 0 || memberRemoved.size != 0) {
                    const memberAddedString = [];
                    for (const role of [...memberAdded.values()]) {
                        memberAddedString.push(`${thread.guild.members.cache.get(role.id)}`);
                    }
                    const memberRemovedString = [];
                    for (const role of [...memberRemoved.values()]) {
                        memberRemovedString.push(`${thread.guild.members.cache.get(role.id)}`);
                    }
                    const embed = this.client.embed()
                        .setAuthor({ name: thread.guild.name, iconURL: thread.guild.iconURL({}) })
                        .setColor(log.color ? log.color : this.client.color.red)
                        .setDescription(`${this.client.emo.update} **${cnType[thread.type]}** Members Updated **${thread.name}**`)
                        .addFields(
                            { name: `Member Added (${memberAdded.size})`, value: memberAddedString.join('\n') || 'None', inline: true },
                            { name: `Member Removed (${memberRemoved.size})`, value: memberRemovedString.join('\n') || 'None', inline: true },
                        )
                        .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                        .setTimestamp();
                    await ClientLogger.sendWebhook(this.client, thread.guild.id, log.textId, {
                        embeds: [embed]
                    });
                }
            }
        } catch (error) {
            this.client.logger.error(error);
        }
    }
}