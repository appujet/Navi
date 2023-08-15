import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, ComponentBuilder, ComponentType, Embed, EmbedBuilder, embedLength } from "discord.js";
import { Navi, Command, Context } from "../structures/index.js";


async function optionsMessage(
    options: {
        command: Command,
        prefix: string,
        ctx: Context,
        client: Navi,
    }
): Promise<void> {
    let { command, prefix, ctx, client } = options;

    let pages = command.options?.map((x) => `\`${prefix + command.name} ${(x as any).required ? `<${x.name}>` : `${x.name}`}${(x as any).options ? (x as any).options.map((d: any) => `${d.required ? `<${d.name}>` : `[${d.name}]`}`).join(" | ") : ""}\`\n> ${x.description}`) || [];
    let copy_pages = pages;

    let page = 1;
    let size = 3;
    let end_index = page * size;
    let start_index = end_index - size;
    let total_pages = Math.ceil(pages.length / size);
    let current_page = 0;

    const commandName = command.name?.toLowerCase();
    let embed = new EmbedBuilder()
        .setColor(client.color.main)
        .setTitle(`Options for ${commandName}`)
        .setDescription(command.description.content || "No description provided.")
        .setFields(
            {
                name: (current_page === 0 ? `Options` : `Examples`),

                value: (current_page === 0 ? `${pages.slice(start_index, end_index).join("\n\n")}` : `${pages.slice(start_index, end_index).join("\n")}`),

                inline: false
            }
        );

    const long_des = 'this is for navigate between pages'
    const button_ids = {
        next_button: "next_button",
        stop_button: "stop_button",
        previous_button: "previous_button",
        examples_button: "examples_button",
        options_button: "options_button",
        home_button: "home_button"
    }
    const next_button = new ButtonBuilder()
        .setCustomId(button_ids.next_button)
        .setEmoji(client.emo.next)
        .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(total_pages > 1 ? false : true);

    const stop_button = new ButtonBuilder()
        .setCustomId(button_ids.stop_button)
        .setEmoji(client.emo.stop)
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false) as any;

    const previous_button = new ButtonBuilder()
        .setCustomId(button_ids.previous_button)
        .setEmoji(client.emo.previous)
        .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(total_pages > 1 ? false : true);

    const examples_button = new ButtonBuilder()
        .setCustomId(button_ids.examples_button)
        .setLabel("Examples")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false) as any;

    const home_button = new ButtonBuilder()
        .setCustomId(button_ids.home_button)
        .setEmoji(client.emo.home)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false) as any;

    const row = new ActionRowBuilder()
        .setComponents(
            previous_button,
            stop_button,
            next_button,
            current_page === 0 ? examples_button : null
        );

    if (!ctx.deferred) {

        await ctx.sendMessage({
            embeds: [embed],
            components: [row] as any[]
        });

    } else {

        await ctx.editMessage({
            embeds: [embed],
            components: [row] as any[]
        });

    };

    const filter = (x: any) => x.user.id === ctx.author?.id && [button_ids.previous_button, button_ids.stop_button, button_ids.next_button, button_ids.examples_button, button_ids.home_button].includes(x.customId);

    const collector = ctx.channel?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        message: ctx.msg || undefined,
        time: 60000,
        filter
    });

    collector?.once("end", async () => {

        previous_button
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        stop_button
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        next_button
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        examples_button
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        home_button
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        row.setComponents(previous_button, stop_button, next_button, (current_page === 0 ? examples_button : home_button));

        await ctx.editMessage({
            components: [row] as any[]
        });

    });

    collector?.on("collect", async (interaction) => {

        if (!interaction.deferred) await interaction.deferUpdate().catch(() => { });

        switch (interaction.customId) {

            case button_ids.stop_button:

                collector.stop();

                break;

            case button_ids.previous_button:

                page = page - 1 < 1 ? total_pages : --page;
                end_index = page * size;
                start_index = end_index - size;

                if (current_page === 0) {

                    embed
                        .setFooter({ text: `<Required> | [Optional] ${long_des} Page ${page} of ${total_pages}` })
                        .spliceFields(0, 1, {

                            name: `Options`,
                            value: pages.slice(start_index, end_index).join("\n\n")

                        });

                } else {

                    embed
                        .setFooter({ text: `<Required> | [Optional] ${long_des} Page ${page} of ${total_pages}` })
                        .spliceFields(0, 1, {

                            name: `Example${pages.length > 1 ? "s" : ""}`,
                            value: pages.slice(start_index, end_index).join("\n")
                        });
                };

                if (interaction.message && interaction.message.editable) {

                    await interaction.message.edit({
                        embeds: [embed]
                    });

                };

                break;

            case button_ids.next_button:

                page = page + 1 > total_pages ? 1 : ++page;
                end_index = page * size;
                start_index = end_index - size;

                if (current_page === 0) {

                    embed
                        .setFooter({ text: `<Required> | [Optional] ${long_des} Page ${page} of ${total_pages}` })
                        .spliceFields(0, 1, {

                            name: `Options`,
                            value: pages.slice(start_index, end_index).join("\n\n")

                        });

                } else {

                    embed
                        .setFooter({ text: `<Required> | [Optional] ${long_des} Page ${page} of ${total_pages}` })
                        .spliceFields(0, 1, {

                            name: `Example${pages.length > 1 ? "s" : ""}`,
                            value: pages.slice(start_index, end_index).join("\n")
                        });
                };

                if (interaction.message && interaction.message.editable) {

                    await interaction.message.edit({
                        embeds: [embed]
                    });

                };

                break;

            case button_ids.examples_button:

                pages = command.description.examples?.map((x) => `\`${prefix}${x}\``) || [];
                size = 5;
                total_pages = Math.ceil(pages.length / size);
                page = 1;
                end_index = page * size;
                start_index = end_index - size;

                embed
                    .spliceFields(0, 1, {

                        name: `Examples`,
                        value: pages.slice(start_index, end_index).join("\n")

                    })
                    .setFooter({ text: `<Required> | [Optional] ${long_des} (page ${page} of ${total_pages})` });

                previous_button
                    .setDisabled(total_pages > 1 ? false : true)
                    .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary);

                next_button
                    .setDisabled(total_pages > 1 ? false : true)
                    .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary);

                row.setComponents(previous_button, stop_button, next_button, home_button);

                if (interaction.message && interaction.message.editable) {

                    await interaction.message.edit({
                        embeds: [embed],
                        components: [row] as any[]
                    });

                };

                current_page = 1;

                break;

            case button_ids.home_button:

                pages = copy_pages;
                size = 3;
                total_pages = Math.ceil(pages.length / size);
                page = 1;
                end_index = page * size;
                start_index = end_index - size;

                embed
                    .spliceFields(0, 1, {

                        name: `Options`,
                        value: pages.slice(start_index, end_index).join("\n\n")
                    })
                    .setFooter({ text: `<Required> | [Optional] ${long_des} Page ${page} of ${total_pages}` });

                previous_button
                    .setDisabled(total_pages > 1 ? false : true)
                    .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary);

                next_button
                    .setDisabled(total_pages > 1 ? false : true)
                    .setStyle(total_pages > 1 ? ButtonStyle.Primary : ButtonStyle.Secondary);

                row
                    .setComponents(
                        previous_button,
                        stop_button,
                        next_button,
                        examples_button
                    );

                if (interaction.message && interaction.message.editable) {

                    await interaction.message.edit({
                        embeds: [embed],
                        components: [row] as any[]
                    });

                };

                current_page = 0;

                break;
        };

    });
}

export {
    optionsMessage,
}