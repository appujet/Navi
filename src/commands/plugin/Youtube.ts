import YouTubeNotification from "../../modules/notification/YouTube.js";
import { Command, Navi, Context } from "../../structures/index.js";


export default class YouTubeCommand extends Command {
    constructor(client: Navi) {
        super(client, {
            name: "youtube",
            description: {
                content: "set or remove your YouTube channel URL for getting notifications when you upload a video.",
                usage: "[url]",
                examples: [
                    "youtube set https://www.youtube.com/channel/UCJFp8uSYCjXOMnkUyb3CQ3Q",
                    "youtube remove"
                ]
            },
            category: "plugin",
            cooldown: 30,
            aliases: ["yt"],
            args: true,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["ManageRoles"]
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "Set your YouTube channel URL for getting notifications when you upload a video.",
                    type: 1,
                    options: [
                        {
                            name: "url",
                            description: "The URL or ID of your YouTube channel.",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove your YouTube channel URL or ID.",
                    type: 1,
                    options: [
                        {
                            name: "url",
                            description: "The URL or ID of your YouTube channel.",
                            type: 3,
                            required: true,
                        }
                    ]
                }
            ]
        });
    }
    public async run(client: Navi, ctx: Context, args: any[]): Promise<any> {
        
        let subCommand: string;
        let id: string;
        let channelId: string;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            if (subCommand === "set" || subCommand === "remove") {
                id = ctx.interaction.options.data[0].options[0].value as string;
            }
        } else {
            subCommand = args[0];
            id = args ? args[1] : null;
            channelId = args ? args[2] : null;
        }
        if (subCommand === "set") {
            const channelId = extractChannelId(id);
            console.log(channelId);
            const YT = new YouTubeNotification(client);
            const checkInYt = await YT.getChannelInfo(channelId);
            if (!checkInYt) {
                return ctx.sendMessage("This channel does not exist.");
            }
            
            const checkDb = await client.prisma.youtube.findUnique({
                where: {
                    guildId: ctx.guild.id,
                    channelId: checkInYt.id
                },
            });
            if (checkDb) {
                    return ctx.sendMessage("This channel is already set.");
            } else {
                const data = await client.prisma.guild.findUnique({
                    where: {
                        guildId: ctx.guild.id
                    },
                    select: {
                        youtube: true
                    }
                });
                if (data) {
                    await client.prisma.guild.update({
                        where: {
                            guildId: ctx.guild.id
                        },
                        data: {
                            youtube: {
                                create: {
                                    channelId: checkInYt.id,
                                    textId: ctx.channel.id,
                                    mode: true
                                }
                            }
                        }
                    });
                    return ctx.sendMessage(`Added channel \`${checkInYt.name}\` to the database.`);
                } else {
                    await client.prisma.youtube.create({
                        data: {
                            guildId: ctx.guild.id,
                            channelId: checkInYt.id,
                            textId: ctx.channel.id,
                            mode: true
                        }
                    });
                    return ctx.sendMessage(`Added channel \`${checkInYt.name}\` to the database.`);
                }
            }
        }
    }
}

function extractChannelId(input: string): string | null {
    // get channel id from url or id and return it e.g: https://www.youtube.com/channel/UCJFp8uSYCjXOMnkUyb3CQ3Q => UCJFp8uSYCjXOMnkUyb3CQ3Q or UCJFp8uSYCjXOMnkUyb3CQ3Q => UCJFp8uSYCjXOMnkUyb3CQ3Q or !yt set https://www.youtube.com/@cnnnews18 => @cnnnews18
    const match = input.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:channel\/|user\/)?(@?[a-zA-Z0-9\-_]{1,})$/);
    if (match) {
        return match[1];
    }
    return null;
}