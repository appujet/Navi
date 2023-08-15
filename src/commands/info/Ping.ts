import { Command, Navi, Context } from "../../structures/index.js";


export default class Ping extends Command {
    constructor(client: Navi) {
        super(client, {
            name: "ping",
            description: {
                content: "Shows the bot's ping",
                examples: ["ping"],
                usage: "ping"
            },
            category: "general",
            aliases: ["pong"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: []
            },
            slashCommand: true,
            options: []
        });
    };
    public async run(client: Navi, ctx: Context, args: string[]): Promise<void> {

        const msg = await ctx.sendDeferMessage('Pinging...');
        const ping = msg.createdTimestamp - ctx.message.createdTimestamp;
        const apiPing = Math.round(client.ws.ping);

        await ctx.editMessage({
            content: `Latency is \`${ping}\`ms. API Latency is \`${apiPing}\`ms`
        })
    }
};


