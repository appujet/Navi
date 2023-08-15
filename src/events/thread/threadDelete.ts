import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";
import { ThreadChannel } from "discord.js";



export default class ThreadDelete extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "threadDelete",
        });
    }
    public async run(thread: ThreadChannel): Promise<any> {
        try {
            
            const log = await Servers.getLogger(thread.guild.id, logType.threadDelete);
            if (!log) return
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
            const user = await this.client.users.fetch(thread.ownerId);
            const embed = this.client.embed()
                .setAuthor({ name: thread.guild.name, iconURL: thread.guild.iconURL({}) })
                .setDescription([`${this.client.emo.delete} **${cnType[thread.type]}** Deleted **${thread.name}**`, '', `**Owner:** ${user.toString()} (\`${user.id}\`)`].join('\n'))
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: 'Channel', value: `${thread.toString()} (\`${thread.id.toString()}\`)`, inline: true },
                    { name: 'Created Time', value: `<t:${Math.floor(thread.createdTimestamp / 1000)}:R> - (<t:${Math.floor(thread.createdTimestamp / 1000)}>)`, inline: true },
                    { name: 'Deleted Time', value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp();
            await ClientLogger.sendWebhook(this.client, thread.guildId, log.textId, {
                embeds: [embed]
            });
        } catch (error) {
            
        }
    }
}