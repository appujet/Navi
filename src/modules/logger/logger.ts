import { Navi } from "../../structures/index.js";
import { TextChannel, WebhookClient, EmbedBuilder } from "discord.js";


export class ClientLogger {

    private static async getWebhook(channelId: string, client: Navi, guildId: string): Promise<any> {
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(channelId) as TextChannel;
        if (!channel) return;
        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.find((w) => w.owner.id === client.user.id) as any;
        if (webhook === undefined) {
            webhook = channel.createWebhook({ name: client.user.username, avatar: client.user.displayAvatarURL({ extension: 'jpg' }), reason: `Logger for ${client.user.username}` }).catch((err) => console.log(err));
        }
        return webhook;
    }
    public static async sendWebhook(client: Navi, guildId: string, channelId: string, options: LogOptions): Promise<any> {
        try {
            let  webhook = await this.getWebhook(channelId, client, guildId);
            const messageOptions: LogOptions = {};
            if (options.content) messageOptions.content = options.content;
            if (options.embeds) messageOptions.embeds = options.embeds;
            if (options.files) messageOptions.files = options.files;
            if (options.components) messageOptions.components = options.components;
            return await (webhook as WebhookClient).send(messageOptions);
        } catch (error) {
            console.log(error);
        }
    }
}

interface LogOptions {
    content?: string;
    embeds?: EmbedBuilder[];
    files?: any[];
    components?: any[];
}
