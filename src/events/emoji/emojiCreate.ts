import { GuildEmoji, AuditLogEvent } from "discord.js";
import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";


export default class EmojiCreate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "emojiCreate",
        });
    }
    public async run(emoji: GuildEmoji): Promise<any> {
        try {
            const log = await Servers.getLogger(emoji.guild.id, logType.EmojiCreate);
            if (!log) return;
            const audit = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiCreate, limit: 1 });
            const entry = audit.entries.first();
            let user = await this.client.users.fetch(entry.executor.id);

            let icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            const embed = this.client.embed()
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.create} Emoji Created`)
                .setColor(log.color ? log.color : this.client.color.red)
                .addFields(
                    { name: "Emoji", value: `<:${emoji.name}:${emoji.id}> (\`${emoji.id}\`)`, inline: true },
                    { name: "Name", value: `\`${emoji.name}\``, inline: true },
                    { name: "Animated", value: `${emoji.animated ? "Yes" : "No"}`, inline: true },
                    { name: "URL", value: `[Click Here](${emoji.url})`, inline: true },
                    { name: "Created Time", value: `<t:${Math.floor(emoji.createdTimestamp / 1000)}:R> - (<t:${Math.floor(emoji.createdTimestamp / 1000)}>)`, inline: true }
                )
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                .setTimestamp();

            await ClientLogger.sendWebhook(this.client, emoji.guild.id, log.textId, {
                embeds: [embed]
            });
        } catch (err) {
            console.log(err);
        }
    }
}