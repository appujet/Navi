import { Navi, Command, Context } from "../../structures/index.js";
import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from "discord.js";
import { Servers } from "../../database/index.js";
import { wlcType, configType, configType2 } from "../../utils/Buttons.js";


export default class Welcome extends Command {
    constructor(client: Navi) {
        super(client, {
            name: "welcome",
            description: {
                content: "Set the welcome message for your server.",
                usage: "welcome #channel Welcome to the server, {user}!",
                examples: ["welcome set #channel Welcome to the server, {user}!", "welcome toggle", "welcome clear"]
            },
            category: "config",
            aliases: ["wset", "wlc"],
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
                    description: "Set the welcome message for your server.",
                    type: 2,
                    options: [
                        {
                            name: "message",
                            description: "The message you want to set as the welcome message.",
                            type: 1,
                            options: [
                                {
                                    name: "channel",
                                    description: "The channel you want to set as the welcome channel.",
                                    type: 7,
                                    required: true
                                },
                                {
                                    name: "message",
                                    description: "The message you want to set as the welcome message.",
                                    type: 3,
                                    required: true
                                }
                            ],
                        },
                        {
                            name: "embed",
                            description: "Set the welcome message for your server.",
                            type: 1,
                            options: [
                                {
                                    name: "title",
                                    description: "The title you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "description",
                                    description: "The description you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "color",
                                    description: "The color you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "thumbnail",
                                    description: "The thumbnail you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "image",
                                    description: "The image you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "footer",
                                    description: "The footer you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "author",
                                    description: "The author you want to set as the welcome message.",
                                    type: 3,
                                    required: false
                                },
                                {
                                    name: "channel",
                                    description: "The channel you want to set as the welcome channel.",
                                    type: 7,
                                },
                            ],
                        },
                    ],
                }, 
                {
                    name: "toggle",
                    description: "Toggle the welcome message for your server.",
                    type: 1,
                },
                {
                    name: "clear",
                    description: "Clear the welcome message for your server.",
                    type: 1,
                },
            ],
        });
    };
    public async run(client: Navi, ctx: Context, args: string[]): Promise<void> {
        let subCommand: any;
        let channel: any;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            channel = ctx.interaction.options.data[0].options[0].value;
        } else {
            subCommand = args[0];
        };
        const data = await Servers.getWelcome(ctx.guild.id);

        const wlcRow = client.utils.createButtonRow(wlcType);

        const embed = client.embed()
            .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
            .setTitle("Welcome Configuration")
            .setColor(client.color.main)
            .setDescription("Please select a channel to set as the welcome channel.")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({}) })
            .setTimestamp();

        const selectMenuChannels = client.utils.getTextChannels(client, ctx.guild.id);

        const channelRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("selectChannel")
                    .setPlaceholder("Select a channel to set as the welcome channel.")
                    .addOptions(selectMenuChannels)
                    .setMaxValues(1)
            );
        let msg: any;
        const finalEmbed = client.embed()
            .setColor(0x0099FF)
            .setTitle('Some title')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
        let finalMsg: any;
        const filter = (i: any) => {
            i.deferUpdate();
            return i.user.id === ctx.author.id;
        };
        if (!data) {
            msg = await ctx.sendMessage({ embeds: [embed], components: [channelRow] });
            const channelCol = msg.awaitMessageComponent({
                filter,
                componentType: ComponentType.StringSelect,
                time: 60000,
                errors: ["time"]
            });

            channelCol.then(async (collected: any) => {
                channel = collected.values[0];
                if (!data) {
                    const embed = client.embed()
                        .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
                        .setTitle("Welcome Configuration")
                        .setColor(client.color.main)
                        .setDescription("Please select a welcome type.")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({}) })
                        .setTimestamp();

                    const channelId = ctx.guild.channels.cache.get(channel) as any;
                    if (!channelId) return;
                    await Servers.setWelChannel(ctx.guild.id, ctx.author.id, channelId.id);
                    msg = await ctx.editMessage({ embeds: [embed], components: [wlcRow] });
                    const typeCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
                    typeCol.then(async (collected: any) => {
                        const type = collected.customId;
                        const embed = client.embed()
                            .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
                            .setTitle("Welcome Configuration")
                            .setColor(client.color.main)
                            .setTimestamp();
                        switch (type) {
                            case "message":
                                embed.setDescription(`Please enter the welcome message you would like to set. You can use the following placeholders: \n\`{user}\` - The user's mention. \n\`{username}\` - The user's username. \n\`{tag}\` - The user's tag. \n\`{server}\` - The server's name. \n\`{membercount}\` - The server's member count.\n\n**Example:**\n\`Welcome {user} to {server}! We now have {membercount} members!\``);
                                await Servers.toggleType(ctx.guild.id, ctx.author.id, {
                                    isMessage: true,
                                });
                                msg = await ctx.editMessage({ embeds: [embed], components: [], fetchReply: true });

                                const messageCol = ctx.channel.awaitMessages({
                                    filter: (m: any) => m.author.id === ctx.author.id,
                                    max: 1, time: 120000, errors: ["time"]
                                });
                                messageCol.then(async (collected: any) => {
                                    const message = collected.first().content;
                                    if (!message) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a message.").setColor(client.color.red)], components: [] });
                                    if (message.length > 1000) return ctx.editMessage({ embeds: [client.embed().setDescription("The message cannot be longer than 1000 characters.").setColor(client.color.red)], components: [] });
                                    await Servers.setWelMessage(ctx.guild.id, ctx.author.id, message)
                                    embed.setDescription(`Welcome message set to: \`${message}\``);
                                    await ctx.editMessage({ embeds: [embed], components: [] });
                                }).catch((err: any) => {
                                    embed.setDescription("You did not enter a message in time.");
                                    return ctx.editMessage({ embeds: [embed], components: [] });
                                });
                                break;
                            case "embed":
                                const embedRow = client.utils.createButtonRow(configType);
                                const embedRow2 = client.utils.createButtonRow(configType2);
                                embed.setDescription(`Please enter the welcome configuration type`)
                                await Servers.toggleType(ctx.guild.id, ctx.author.id, {
                                    isEmbed: true,
                                });
                                msg = await ctx.editMessage({ embeds: [embed], components: [embedRow, embedRow2] });
                                const embedCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
                                embedCol.then(async (collected: any) => {
                                    const type = collected.customId;
                                    const embed = client.embed()
                                        .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
                                        .setTitle("Welcome Configuration")
                                        .setColor(client.color.main)
                                        .setTimestamp();
                                    switch (type) {
                                        case "title":
                                            embed.setDescription(`Please enter the title you would like to set.`)
                                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                            const titleCol = ctx.channel.awaitMessages({
                                                filter: (m: any) => m.author.id === ctx.author.id,
                                                max: 1, time: 120000, errors: ["time"]
                                            });
                                            titleCol.then(async (collected: any) => {
                                                const title = collected.first().content;
                                                if (!title) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a title.").setColor(client.color.red)], components: [] });
                                                if (title.length > 256) return ctx.editMessage({ embeds: [client.embed().setDescription("The title cannot be longer than 256 characters.").setColor(client.color.red)], components: [] });
                                                await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                                    title: title,
                                                });
                                                embed.setDescription(`Welcome embed title set to: \`${title}\``);
                                                await ctx.editMessage({ embeds: [embed], components: [] });
                                            }).catch((err: any) => {
                                                embed.setDescription("You did not enter a title in time.");
                                                return ctx.editMessage({ embeds: [embed], components: [] });
                                            });
                                            break;
                                        case "description":
                                            embed.setDescription(`Please enter the description you would like to set.`)
                                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                            const descriptionCol = ctx.channel.awaitMessages({
                                                filter: (m: any) => m.author.id === ctx.author.id,
                                                max: 1, time: 120000, errors: ["time"]
                                            });
                                            descriptionCol.then(async (collected: any) => {
                                                const description = collected.first().content;
                                                if (!description) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a description.").setColor(client.color.red)], components: [] });
                                                if (description.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The description cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                                await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                                    description: description,
                                                });
                                                embed.setDescription(`Welcome embed description set to: \`${description}\``);
                                                await ctx.editMessage({ embeds: [embed], components: [] });
                                            }).catch((err: any) => {
                                                embed.setDescription("You did not enter a description in time.");
                                                return ctx.editMessage({ embeds: [embed], components: [] });
                                            });
                                            break;
                                        case "color":
                                            embed.setDescription(`Please enter the color you would like to set.`)
                                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                            const colorCol = ctx.channel.awaitMessages({
                                                filter: (m: any) => m.author.id === ctx.author.id,
                                                max: 1, time: 120000, errors: ["time"]
                                            });
                                            colorCol.then(async (collected: any) => {
                                                const color = collected.first().content;
                                                if (!color) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a color.").setColor(client.color.red)], components: [] });
                                                if (!color.match(/^#([0-9a-f]{3}){1,2}$/i)) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a valid hex color.").setColor(client.color.red)], components: [] });
                                                await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                                    color: color,
                                                });
                                                embed.setDescription(`Welcome embed color set to: \`${color}\``);
                                                await ctx.editMessage({ embeds: [embed], components: [] });
                                            }).catch((err: any) => {
                                                embed.setDescription("You did not enter a color in time.");
                                                return ctx.editMessage({ embeds: [embed], components: [] });
                                            });
                                            break;
                                        case "footer":
                                            embed.setDescription(`Please enter the footer you would like to set.`)
                                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                            const footerCol = ctx.channel.awaitMessages({
                                                filter: (m: any) => m.author.id === ctx.author.id,
                                                max: 1, time: 120000, errors: ["time"]
                                            });
                                            footerCol.then(async (collected: any) => {
                                                const footer = collected.first().content;
                                                if (!footer) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a footer.").setColor(client.color.red)], components: [] });
                                                if (footer.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The footer cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                                await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                                    footer: footer,
                                                });
                                                embed.setDescription(`Welcome embed footer set to: \`${footer}\``);
                                                await ctx.editMessage({ embeds: [embed], components: [] });
                                            }).catch((err: any) => {
                                                embed.setDescription("You did not enter a footer in time.");
                                                return ctx.editMessage({ embeds: [embed], components: [] });
                                            });
                                            break;
                                        case "thumbnail":
                                            embed.setDescription(`Please enter the thumbnail you would like to set.`)
                                            msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                            const thumbnailCol = ctx.channel.awaitMessages({
                                                filter: (m: any) => m.author.id === ctx.author.id,
                                                max: 1, time: 120000, errors: ["time"]
                                            });
                                            thumbnailCol.then(async (collected: any) => {
                                                console.log(collected.first().attachments)
                                            });
                                            break;
                                    }
                                }).catch((err: any) => {
                                    embed.setDescription("You did not enter a configuration type in time.");
                                    return ctx.editMessage({ embeds: [embed], components: [] });
                                });
                                break;
                        }
                    }).catch((err: any) => {
                        embed.setDescription("You did not enter a welcome type in time.");
                        return ctx.editMessage({ embeds: [embed], components: [] });
                    });
                }
            }).catch((err: any) => {
                embed.setDescription("You did not enter a welcome type in time.");
                return ctx.editMessage({ embeds: [embed], components: [] });
            });

        } else {
            const embed = client.embed()
                .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
                .setTitle("Welcome Configuration")
                .setColor(client.color.main)
                .setDescription("Please select a welcome type.")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({}) })
                .setTimestamp();
            msg = await ctx.sendMessage({ embeds: [embed], components: [wlcRow] });
            const wlcCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
            wlcCol.then(async (collected: any) => {
                const type = collected.customId;
                switch (type) {
                    case "message":
                        await Servers.toggleType(ctx.guild.id, ctx.author.id, {
                            isMessage: true,
                        });
                        embed.setDescription(`Please enter the welcome message you would like to set. You can use the following placeholders: \n\`{user}\` - The user's mention. \n\`{username}\` - The user's username. \n\`{tag}\` - The user's tag. \n\`{server}\` - The server's name. \n\`{membercount}\` - The server's member count.\n\n**Example:**\n\`Welcome {user} to {server}! We now have {membercount} members!\``);
                        msg = await ctx.editMessage({ embeds: [embed], components: [], fetchReply: true });

                        const messageCol = ctx.channel.awaitMessages({
                            filter: (m: any) => m.author.id === ctx.author.id,
                            max: 1, time: 120000, errors: ["time"]
                        });
                        messageCol.then(async (collected: any) => {
                            const message = collected.first().content;
                            if (!message) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a message.").setColor(client.color.red)], components: [] });
                            if (message.length > 1000) return ctx.editMessage({ embeds: [client.embed().setDescription("The message cannot be longer than 1000 characters.").setColor(client.color.red)], components: [] });
                            await Servers.setWelMessage(ctx.guild.id, ctx.author.id, message)
                            embed.setDescription(`Welcome message set to: \`${message}\``);
                            embed.setTitle("Successfully set welcome message!");
                            await ctx.editMessage({ embeds: [embed], components: [] });
                        }).catch((err: any) => {
                            embed.setDescription("You did not enter a message in time.");
                            return ctx.editMessage({ embeds: [embed], components: [] });
                        });
                        break;
                    case "embed":
                        const embedRow = client.utils.createButtonRow(configType);
                        const embedRow2 = client.utils.createButtonRow(configType2);
                        embed.setDescription(`Please enter the welcome configuration type`)
                        await Servers.toggleType(ctx.guild.id, ctx.author.id, {
                            isEmbed: true,
                        });
                        finalMsg = await ctx.editMessage({ embeds: [finalEmbed], components: [] });
                        msg = await ctx.sendMessage({ embeds: [embed], components: [embedRow, embedRow2] });
                        let embedCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
                        embedCol.then(async (collected: any) => {
                            const type = collected.customId;
                            const embed = client.embed()
                                .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({}) })
                                .setTitle("Welcome Configuration")
                                .setColor(client.color.main)
                                .setTimestamp();
                            switch (type) {
                                case "title":
                                    embed.setDescription(`Please enter the title you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const titleCol = ctx.channel.awaitMessages({
                                        filter: (m: any) => m.author.id === ctx.author.id,
                                        max: 1, time: 120000, errors: ["time"]
                                    });
                                    titleCol.then(async (collected: any) => {
                                        const title = collected.first().content;
                                        if (!title) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a title.").setColor(client.color.red)], components: [] });
                                        if (title.length > 256) return ctx.editMessage({ embeds: [client.embed().setDescription("The title cannot be longer than 256 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            title: title,
                                        });
                                        embed.setDescription(`Welcome embed title set to: \`${title}\``);
                                        finalEmbed.setTitle(title);
                                        msg = await ctx.editMessage({ embeds: [embed], components: [embedRow, embedRow2] });
                                        embedCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
                                        if (finalMsg) await finalMsg.edit({ embeds: [finalEmbed], components: [] });
                                    }).catch((err: any) => {
                                        console.log(err);
                                        embed.setDescription("You did not enter a title in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                                case "description":
                                    embed.setDescription(`Please enter the description you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const descriptionCol = ctx.channel.awaitMessages({
                                        filter: (m: any) => m.author.id === ctx.author.id,
                                        max: 1, time: 120000, errors: ["time"]
                                    });
                                    descriptionCol.then(async (collected: any) => {
                                        const description = collected.first().content;
                                        if (!description) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a description.").setColor(client.color.red)], components: [] });
                                        if (description.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The description cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            description: description,
                                        });
                                        embed.setDescription(`Welcome embed description set to: \`${description}\``);
                                        msg = await ctx.editMessage({ embeds: [embed], components: [embedRow, embedRow2] });
                                        embedCol = msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000, errors: ["time"] });
                                        if (finalMsg) await finalMsg.edit({ embeds: [finalEmbed.setDescription(description)], components: [] });
                                    }).catch((err: any) => {
                                        embed.setDescription("You did not enter a description in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                                case "color":
                                    embed.setDescription(`Please enter the color you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const colorCol = ctx.channel.awaitMessages({ filter: (m: any) => m.author.id === ctx.author.id, max: 1, time: 120000, errors: ["time"] });
                                    colorCol.then(async (collected: any) => {
                                        const color = collected.first().content;
                                        if (!color) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a color.").setColor(client.color.red)], components: [] });
                                        if (color.length > 7) return ctx.editMessage({ embeds: [client.embed().setDescription("The color cannot be longer than 7 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            color: color,
                                        });
                                        embed.setDescription(`Welcome embed color set to: \`${color}\``);
                                        await ctx.editMessage({ embeds: [embed], components: [] });
                                    }).catch((err: any) => {
                                        embed.setDescription("You did not enter a color in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                                case "footer":
                                    embed.setDescription(`Please enter the footer you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const footerCol = ctx.channel.awaitMessages({ filter: (m: any) => m.author.id === ctx.author.id, max: 1, time: 120000, errors: ["time"] });
                                    footerCol.then(async (collected: any) => {
                                        const footer = collected.first().content;
                                        if (!footer) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a footer.").setColor(client.color.red)], components: [] });
                                        if (footer.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The footer cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            footer: footer,
                                        });
                                        embed.setDescription(`Welcome embed footer set to: \`${footer}\``);
                                        await ctx.editMessage({ embeds: [embed], components: [] });
                                    }).catch((err: any) => {
                                        embed.setDescription("You did not enter a footer in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                                case "thumbnail":
                                    embed.setDescription(`Please enter the thumbnail you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const thumbnailCol = ctx.channel.awaitMessages({ filter: (m: any) => m.author.id === ctx.author.id, max: 1, time: 120000, errors: ["time"] });
                                    thumbnailCol.then(async (collected: any) => {
                                        const thumbnail = collected.first().attachments ? collected.first().attachments.first().url : collected.first().content;
                                        if (!thumbnail) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter a thumbnail.").setColor(client.color.red)], components: [] });
                                        if (thumbnail.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The thumbnail cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            thumbnail: thumbnail,
                                        });
                                        embed.setImage(thumbnail);
                                        embed.setDescription(`Welcome embed thumbnail set to: \`${thumbnail}\``);
                                        await ctx.editMessage({ embeds: [embed], components: [] });
                                    }).catch((err: any) => {
                                        embed.setDescription("You did not enter a thumbnail in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                                case "image":
                                    embed.setDescription(`Please enter the image you would like to set.`)
                                    msg = await ctx.editMessage({ embeds: [embed], components: [] });
                                    const imageCol = ctx.channel.awaitMessages({ filter: (m: any) => m.author.id === ctx.author.id, max: 1, time: 120000, errors: ["time"] });
                                    imageCol.then(async (collected: any) => {
                                        const image = collected.first().attachments ? collected.first().attachments.first().url : collected.first().content;
                                        if (!image) return ctx.editMessage({ embeds: [client.embed().setDescription("You must enter an image.").setColor(client.color.red)], components: [] });
                                        if (image.length > 2048) return ctx.editMessage({ embeds: [client.embed().setDescription("The image cannot be longer than 2048 characters.").setColor(client.color.red)], components: [] });
                                        await Servers.setWelEmbed(ctx.guild.id, ctx.author.id, {
                                            image: image,
                                        });
                                        embed.setImage(image);
                                        embed.setDescription(`Welcome embed image set to: \`${image}\``);
                                        await ctx.editMessage({ embeds: [embed], components: [] });
                                    }).catch((err: any) => {
                                        embed.setDescription("You did not enter an image in time.");
                                        return ctx.editMessage({ embeds: [embed], components: [] });
                                    });
                                    break;
                            }
                        }).catch((err: any) => {
                            embed.setDescription("You did not enter a configuration type in time.");
                            return ctx.editMessage({ embeds: [embed], components: [] });
                        });
                        break;
                }
            }).catch((err: any) => {
                embed.setDescription("You did not enter a configuration type in time.");
                return ctx.editMessage({ embeds: [embed], components: [] });
            });
        }
    }
}