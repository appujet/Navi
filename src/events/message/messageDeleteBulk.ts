import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { Message, ChannelType, TextChannel, Collection } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class MessageDeleteBulk extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "messageDeleteBulk",
        });
    }

    public async run(messages: Collection<string, Message>): Promise<any> {
        if (messages.size === 0) return;

        const message = messages.first();
        if (!message) return;
        if (message.channel.type === ChannelType.DM) return;
        const guildId = message.guildId;
        const log = await Servers.getLogger(guildId, logType.BulkMessageDelete);
        if (!log) return;

        const embed = this.client.embed()
            .setColor(log.color ? log.color : this.client.color.red)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({}) })
            .setTitle(`${this.client.emo.delete} Bulk Message Delete`)
            .setDescription(`\`${messages.size}\` messages were deleted`)
            .addFields(
                { name: "Channel", value: `<#${message.channelId}>`, inline: false },
                { name: "Member", value: `<@${message.author.id}>`, inline: false },
                { name: "Deleted Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
            )
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

        await ClientLogger.sendWebhook(this.client, message.guildId, log.textId, {
            embeds: [embed]
        });
    }
}