import { GuildEmoji, AuditLogEvent } from "discord.js";
import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Servers, logType } from "../../database/index.js";


export default class EmojiUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "emojiUpdate",
        });
    }
    public async run(oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<any> {
        const log = await Servers.getLogger(oldEmoji.guild.id, logType.EmojiUpdate);
        if (!log) return;
        const audit = await oldEmoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate, limit: 1 });
        const entry = audit.entries.first();
        let user = await this.client.users.fetch(entry.executor.id);

        let icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

        const embed = this.client.embed()
            .setAuthor({ name: user.tag, iconURL: icon })
            .setTitle(`${this.client.emo.update} Emoji Updated`)
            .setColor(log.color ? log.color : this.client.color.red)
            .addFields(
                { name: "Emoji", value: `<:${oldEmoji.name}:${oldEmoji.id}> (\`${oldEmoji.id}\`)`, inline: true },
                { name: "Old Name", value: `\`${oldEmoji.name}\``, inline: true },
                { name: "New Name", value: `\`${newEmoji.name}\``, inline: true },
                { name: "Animated", value: `\`${oldEmoji.animated ? "Yes" : "No"}\``, inline: true },
                { name: "Created Time", value: `<t:${Math.floor(oldEmoji.createdTimestamp / 1000)}:R> - (<t:${Math.floor(oldEmoji.createdTimestamp / 1000)}>)`, inline: true },
                { name: "Updated Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: true }
            )
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            .setTimestamp();

        await ClientLogger.sendWebhook(this.client, oldEmoji.guild.id, log.textId, {
            embeds: [embed]
        });
    }
}