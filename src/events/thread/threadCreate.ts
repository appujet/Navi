import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";
import { ThreadChannel, AuditLogEvent } from "discord.js";


export default class ThreadCreate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "threadCreate",
        });
    }
    public async run(thread: ThreadChannel): Promise<any> {
        try {
            await thread.join();
        } catch (err) {
            this.client.logger.error(err);
        }
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
            const log = await Servers.getLogger(thread.guildId, logType.threadCreate);
            if (!log) return;

            const user = await this.client.users.fetch(thread.ownerId);

            const embed = this.client.embed()
                .setAuthor({ name: thread.guild.name, iconURL: thread.guild.iconURL({ }) })
                .setDescription([`${this.client.emo.create} **${cnType[thread.type]}** Created **${thread.name}**`, '', `**Owner:** ${user.toString()} (\`${user.id}\`)`].join('\n'))
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: 'Channel', value: `${thread.toString()} (\`${thread.id.toString()}\`)`, inline: true },
                    { name: 'Created Time', value: `<t:${Math.floor(thread.createdTimestamp / 1000)}:R> - (<t:${Math.floor(thread.createdTimestamp / 1000)}>)`, inline: true },
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