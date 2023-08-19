import { Servers, logType } from "../../database/index.js";
import { Command, Navi, Context } from "../../structures/index.js";
import { StringSelectMenuBuilder, ComponentType, ActionRowBuilder, ChannelType } from "discord.js";
import { LogType2, logType1 } from "../../utils/Buttons.js";
import { sLevl, mLevl, mLevl2, cLevl, rLevl, vLevl, tLevl } from "../../utils/seleteManus.js";


export default class LoggerCmd extends Command {
    constructor(client: Navi) {
        super(client, {
            name: "logger",
            description: {
                content: "Configures the auditlog channel for the server",
                examples: ["logger set", "logger toggle", "logger clear #channel", "logger info"],
                usage: "<set | toggle | clear> [channel] | info"
            },
            category: "config",
            aliases: ["log", "logs"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["ManageGuild"]
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "Sets up the log channel for the server",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "The channel you want to set as the log channel",
                            type: 7,
                            required: true
                        },
                        {
                            name: "type",
                            description: "The type of logs you want to enable for the server",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "Server Logs",
                                    value: "server"
                                },
                                {
                                    name: "Member Logs",
                                    value: "member"
                                },
                                {
                                    name: "Message Logs",
                                    value: "message"
                                },
                                {
                                    name: "Channel Logs",
                                    value: "channel"
                                },
                                {
                                    name: "Role Logs",
                                    value: "role"
                                },
                                {
                                    name: "Voice Logs",
                                    value: "voice"
                                },
                                {
                                    name: "Thread Logs",
                                    value: "thread"
                                }
                            ],
                            maxLength: 1
                        },
                    ]
                },
                {
                    name: "toggle",
                    description: "Toggles the log channel for the server",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "The channel you want to toggle the log channel",
                            type: 7,
                            required: true
                        },
                        {
                            name: "mode",
                            description: "The mode you want to toggle the log channel",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "Enable",
                                    value: "enable"
                                },
                                {
                                    name: "Disable",
                                    value: "disable"
                                },
                            ],
                            maxLength: 1
                        }
                    ],
                },
                {
                    name: "clear",
                    description: "Clears the log channel for the server",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "The channel you want to clear the log channel",
                            type: 7,
                            required: true
                        }
                    ]
                },
                {
                    name: "info",
                    description: "Shows the log channel for the server",
                    type: 1
                }
            ]
        });
    };
    public async run(client: Navi, ctx: Context, args: string[]): Promise<void> {
        let SubCommand: any;
        let channel: any;
        let type: any;
        let mode: any;
        if (ctx.isInteraction) {
            SubCommand = ctx.interaction.options.data[0].name;
            if (ctx.interaction.options.data[0].options) {
                channel = ctx.interaction.options.data[0].options[0]?.channel;
                type = ctx.interaction.options.data[0].options[1]?.value;
                mode = ctx.interaction.options.data[0].options[1]?.value;
            }
        } else {
            SubCommand = args[0];
            if (args[1]) {
                channel = ctx.message.mentions.channels.first() || ctx.guild.channels.cache.get(args[1]);
            }
        };

        let color = '#2F3136';
        if (ctx.isInteraction) {
            if ((["s", "set", "enable", "add"].includes(SubCommand))) {
                const type = ctx.interaction.options.data[0].options[1].value;
                const embed = this.client.embed()
                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                    .setColor(client.color.main)
                    .setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                let msg: any;
                const filter = (i: any) => {
                    i.deferUpdate();
                    return i.user.id === ctx.author.id;
                }
                let logTypes: any[] = [];

                switch (type) {
                    case "server":
                        const serverRow = client.utils.createSelectMenuRow(sLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [serverRow] });
                        const serverCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        serverCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "message":
                        const messageRow = client.utils.createSelectMenuRow(mLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [messageRow] });
                        const messageCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        messageCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "voice":
                        const voiceRow = client.utils.createSelectMenuRow(vLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [voiceRow] });
                        const voiceCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        voiceCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "member":
                        const memberRow = client.utils.createSelectMenuRow(mLevl2);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [memberRow] });
                        const memberCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        memberCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "role":
                        const roleRow = client.utils.createSelectMenuRow(rLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [roleRow] });
                        const roleCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        roleCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "channel":
                        const channelRow = client.utils.createSelectMenuRow(cLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [channelRow] });
                        const channelCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        channelCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                    case "thread":
                        const threadRow = client.utils.createSelectMenuRow(tLevl);
                        embed.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                        msg = await ctx.sendMessage({ embeds: [embed], components: [threadRow] });
                        const threadCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                        threadCol.then(async (i: any) => {
                            for (const value of i.values) {
                                logTypes.push(value);
                            }
                            await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                            const embed = this.client.embed()
                                .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                .setColor(client.color.main)
                            embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                            await ctx.editMessage({ embeds: [embed], components: [] });
                            logTypes = [];
                        }).catch(async (err: any) => {
                            embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                            return;
                        });
                        break;
                }
            } else if (["toggle", "t"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendEphemeral({ content: "There is no log channel set for this server.", ephemeral: true });
                if (!channel) return ctx.sendEphemeral({ content: "Please provide a channel to set as the log channel.", ephemeral: true });
                if (channel.type !== ChannelType.GuildText) return ctx.sendEphemeral({ content: "Please provide a text channel to set as the log channel.", ephemeral: true });

                switch (mode) {
                    case "enable":
                        if (!data) return ctx.sendEphemeral({ content: "There is no log channel set for this server.", ephemeral: true });
                        if (data && data.mode === true) return ctx.sendEphemeral({ content: `The logger is already enabled for this server.`, ephemeral: true });
                        await Servers.toggleLogger(ctx.guild.id, ctx.author.id, data.type, channel.id, false)
                        const embed = this.client.embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                            .setColor(client.color.main)
                        embed.setDescription(`Successfully enabled the logger for the server.`)
                        await ctx.editMessage({ embeds: [embed], components: [] });
                        break;
                    case "disable":
                        if (!data) return ctx.sendEphemeral({ content: "There is no log channel set for this server.", ephemeral: true });
                        if (data && data.mode === false) return ctx.sendEphemeral({ content: `The logger is already disabled for this server.`, ephemeral: true });
                        await Servers.toggleLogger(ctx.guild.id, ctx.author.id, data.type, channel.id, true)
                        const embed2 = this.client.embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                            .setColor(client.color.main)
                        embed2.setDescription(`Successfully disabled the logger for the server.`)
                        await ctx.editMessage({ embeds: [embed2], components: [] });
                        break;
                    default:
                        return ctx.sendEphemeral({ content: "Please provide a valid mode to toggle the log type.", ephemeral: true });
                }
            } else if (["clear", "c"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendEphemeral({ content: "There is no log channel set for this server.", ephemeral: true });
                if (!channel) return ctx.sendEphemeral({ content: "Please provide a channel to set as the log channel.", ephemeral: true });
                if (channel.type !== ChannelType.GuildText) return ctx.sendEphemeral({ content: "Please provide a text channel to set as the log channel.", ephemeral: true });
                const embed = this.client.embed()
                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                    .setColor(client.color.main)
                embed.setDescription(`Successfully cleared the log channel for the server.`)
                await Servers.clearLogger(ctx.guild.id, channel.id)
                ctx.sendMessage({ embeds: [embed], components: [] });
            } else if (["info", "i"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendEphemeral({ content: "There is no log channel set for this server.", ephemeral: true });

                const fields = [];
                const channels = await client.prisma.logChannel.findMany({ where: { guildId: ctx.guild.id } });
                channels.map((c: any, i: any) => {
                    fields.push({ name: `**#${i + 1}**`, value: `> Channel: <#${c.textId}>\n> Log Types: \`${c.type.join(", ")}\`\n> Moderator: <@${c.moderator}>` })
                })
                let chunks = client.utils.chunk(fields, 5);
                if (chunks.length === 0) chunks = [fields];
                const pages = [];
                for (let i = 0; i < chunks.length; i++) {
                    const embed = this.client.embed()
                        .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                        .setColor(client.color.main)
                    embed.setDescription(`Here is the list of all the log channels set for this server.`)
                    embed.addFields(fields)
                    embed.setFooter({ text: `Page ${i + 1} of ${chunks.length}` })
                    pages.push(embed);
                }
                return client.utils.paginate(ctx, pages);
            }
        } else {
            if (["s", "set"].includes(SubCommand)) {
                const row = client.utils.createButtonRow(logType1);
                const row2 = client.utils.createButtonRow(LogType2);

                const selectMenuChannels = client.utils.getTextChannels(client, ctx.guild.id);

                const channelRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("selectChannel")
                            .setPlaceholder("Select a channel to set as the log channel")
                            .addOptions(selectMenuChannels)
                            .setMaxValues(1)
                    );

                let channelId: any;
                const embed = this.client.embed()
                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                    .setColor(client.color.main)
                embed.setDescription(`Please select the channel you want to set as the log channel.`)

                let msg = await ctx.sendMessage({ embeds: [embed], components: [channelRow] });
                const filter = async (i: any) => {
                    i.deferUpdate();
                    return i.user.id === ctx.author.id;
                };
                if (channel) {
                    if (channel.type !== ChannelType.GuildText) {
                        embed.setDescription(`Please provide a text channel to set as the log channel.`)
                        return ctx.editMessage({ embeds: [embed], components: [channelRow] });
                    }
                    channelId = channel.id;
                }
                const channelCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect, errors: ["time"] });
                channelCol.then(async (i: any) => {
                    channelId = i.values[0];
                    embed.setDescription(`Please select the type of logs you want to enable for the server.`)
                    msg = await ctx.editMessage({ embeds: [embed], components: [row, row2] });
                }).catch(async (err: any) => {
                    embed.setDescription(`You did not select a channel in time, please try again.`)
                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                });

                const collector = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.Button, errors: ["time"] });
                collector.then(async (i: any) => {
                    const type = i.customId;

                    const embed1 = this.client.embed()
                        .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                        .setColor(client.color.main)
                    let logTypes = [];
                    const channel = ctx.guild.channels.cache.get(channelId) as any;
                    if (!channel) return ctx.editMessage({ embeds: [embed.setDescription(`Please mention a valid channel to set as the log channel for the server.`)], components: [channelRow] });

                    switch (type) {
                        case "server":
                            const serverRow = client.utils.createSelectMenuRow(sLevl)
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [serverRow] });
                            const serverCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            serverCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                channelId = null;
                                logTypes = [];
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "message":
                            const messageRow = client.utils.createSelectMenuRow(mLevl)
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [messageRow] });
                            const messageCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            messageCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                channelId = null;
                                logTypes = [];
                            }).catch(async (err: any) => {
                                console.log(err)
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "member":
                            const memberRow = client.utils.createSelectMenuRow(mLevl2)
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [memberRow] });
                            const memberCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            memberCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                channelId = null;
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "channel":
                            const channelSeleteRow = client.utils.createSelectMenuRow(cLevl)
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [channelSeleteRow] });
                            const channelCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            channelCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                logTypes = [];
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "role":
                            const roleRow = client.utils.createSelectMenuRow(rLevl)
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [roleRow] });
                            const roleCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            roleCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                logTypes = [];
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "voice":
                            const voiceRow = client.utils.createSelectMenuRow(vLevl);
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [voiceRow] });
                            const voiceCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            voiceCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                logTypes = [];
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                        case "thread":
                            const threadRow = client.utils.createSelectMenuRow(tLevl);
                            embed1.setDescription(`Please select the type of logs you want to enable for the server.\nLog Types: \`${Object.values(logType).join(", ")}\``)
                            msg = await ctx.editMessage({ embeds: [embed1], components: [threadRow] });
                            const threadCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                            threadCol.then(async (i: any) => {
                                for (const value of i.values) {
                                    logTypes.push(value);
                                }
                                await Servers.setLogger(ctx.guild.id, ctx.author.id, logTypes, channel.id, color);
                                const embed = this.client.embed()
                                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                                    .setColor(client.color.main)
                                embed.setDescription(`Successfully set the log channel for the server to ${channel} and enabled the following log types: \`${logTypes.join(", ")}\``)
                                ctx.editMessage({ embeds: [embed], components: [] });
                                logTypes = [];
                            }).catch(async (err: any) => {
                                embed1.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                                msg = await ctx.editMessage({ embeds: [embed1], components: [] });
                                return;
                            });
                            break;
                    }
                }).catch(async (err: any) => {
                    embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                    return;
                });
            } else if (["t", "toggle"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendMessage({ content: "There is no log channel set for this server." });
                if (!channel) return ctx.sendMessage({ content: "Please provide a channel to set as the log channel." });
                if (channel.type !== ChannelType.GuildText) return ctx.sendMessage({ content: "Please provide a text channel to set as the log channel." });

                switch (mode) {
                    case "enable":
                        if (!data) return ctx.sendMessage({ content: "There is no log channel set for this server." });
                        if (data && data.mode === true) return ctx.sendMessage({ content: "The log channel is already enabled for this server." });
                        await Servers.toggleLogger(ctx.guild.id, ctx.author.id, data.type, channel.id, false)
                        const embed = this.client.embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                            .setColor(client.color.main)
                        embed.setDescription(`Successfully enabled the log type \`${type}\` for the server.`)
                        ctx.editMessage({ embeds: [embed], components: [] });
                        break;
                    case "disable":
                        if (!data) return ctx.sendMessage({ content: "There is no log channel set for this server." });
                        if (data && data.mode === false) return ctx.sendMessage({ content: "The log channel is already disabled for this server." });
                        await Servers.toggleLogger(ctx.guild.id, ctx.author.id, data.type, channel.id, true)
                        const embed2 = this.client.embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                            .setColor(client.color.main)
                        embed2.setDescription(`Successfully disabled the log type \`${type}\` for the server.`)
                        ctx.editMessage({ embeds: [embed2], components: [] });
                        break;
                    default:
                        return ctx.sendMessage({ content: "Please provide a valid mode to toggle the log type." });
                }
            } else if (["c", "clear"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendMessage({ content: "There is no log channel set for this server." });
                const selectMenuChannels = client.utils.getTextChannels(client, ctx.guild.id);

                const channelRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("selectChannel")
                            .setPlaceholder("Select a channel to set as the log channel")
                            .addOptions(selectMenuChannels)
                            .setMaxValues(1)
                    );
                const embed = this.client.embed()
                    .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                    .setColor(client.color.main)
                embed.setDescription(`Please select the channel you want to set as the log channel.`)

                let msg = await ctx.sendMessage({ embeds: [embed], components: [channelRow] });
                const filter = (i: any) => i.user.id === ctx.author.id;
                const channelCol = msg.awaitMessageComponent({ filter, time: 60000, componentType: ComponentType.StringSelect });
                let chan: any;
                channelCol.then(async (i: any) => {
                    for (const value of i.values) {
                        chan = value;
                    }
                    await Servers.clearLogger(ctx.guild.id, chan.id);
                    const embed = this.client.embed()
                        .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                        .setColor(client.color.main)
                    embed.setDescription(`Successfully cleared the log channel for the server.`)
                    await ctx.editMessage({ embeds: [embed], components: [] });
                }).catch(async (err: any) => {
                    embed.setDescription(`You took too long to respond, please run the command again to set the log channel.`)
                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                    return;
                });
            } else if (["l", "list"].includes(SubCommand)) {
                const data = await client.prisma.logChannel.findFirst({ where: { guildId: ctx.guild.id } });
                if (!data) return ctx.sendMessage({ content: "There is no log channel set for this server." });
                const fields = [];
                const channels = await client.prisma.logChannel.findMany({ where: { guildId: ctx.guild.id } });
                channels.map((c: any, i: any) => {
                    fields.push({ name: `**#${i + 1}**`, value: `> Channel: <#${c.textId}>\n> Log Types: \`${c.type.join(", ")}\`\n> Moderator: <@${c.userId}>` })
                })
                let chunks = client.utils.chunk(fields, 5);
                if (chunks.length === 0) chunks = [fields];
                const pages = [];
                for (let i = 0; i < chunks.length; i++) {
                    const embed = this.client.embed()
                        .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                        .setColor(client.color.main)
                    embed.setDescription(`Here is the list of all the log channels set for this server.`)
                    embed.addFields(fields)
                    embed.setFooter({ text: `Page ${i + 1} of ${chunks.length}` })
                    pages.push(embed);
                }
                return client.utils.paginate(ctx, pages);
            }
        }
    }
}