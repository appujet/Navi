import { Guild, Message, TextChannel, User } from "discord.js";
import badWordList from "../../assets/json/badWords.json" assert { type: "json" };
import toxicityWordsList from "../../assets/json/toxicWords.json" assert { type: "json" };
import { Navi } from '../../structures/index.js';
import { PunishmentType } from "@prisma/client";

export default class BadWord {
    public static badWords = badWordList;
    public static toxicityWords = toxicityWordsList;
    public static toxicityThreshold: string = "0";
    public static async check(client: Navi, message: Message): Promise<void> {
        if (message.author.bot) return;

        const data = await client.prisma.autoMod.findFirst({
            where: {
                guildId: message.guild?.id
            }
        });
        if (data && data.badWords && data.badWordsList && data.toxicityThreshold) {
            this.badWords.push(...data.badWordsList);
            const punishment = data.badWordsPun || PunishmentType.NONE;
            const words = message.content.toLowerCase().split(/\s+/);

            let containsBadWord = false;

            for (const word of words) {
                if (this.badWords.includes(word)) {
                    await this.handleBadWord(message, punishment, client);
                    containsBadWord = true;
                    break;
                }
            }

            if (!containsBadWord) {
                let toxicityScore = 0;
                for (const word of words) {
                    if (this.toxicityWords.includes(word)) {
                        toxicityScore += 1;
                    }
                }
                const toxicityRate = (toxicityScore / words.length) * 100;
                console.log(toxicityRate);
                if (toxicityRate >= data.toxicityThreshold) {
                    this.toxicityThreshold = toxicityRate.toFixed(2);
                    await this.handleToxicity(message, punishment, client);
                }
            }
        }
    }
    private static async handleBadWord(message: Message, punishment: PunishmentType, client: Navi): Promise<void> {
        try {
            const member = await message.guild?.members.fetch(message.author.id);
            if (member) {
                switch (punishment) {
                    case PunishmentType.NONE:
                        message.delete().catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has used a bad word.\n> Reason: Detected bad word\n> Action Taken: None`
                        }).catch(() => { });
                        break;
                    case PunishmentType.BAN:
                        await member.ban({ reason: "Detected bad word" }).catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been banned from the server.\n> Reason: Detected bad word\n> Action Taken: Ban`
                        }).catch(() => { });
                        break;
                    case PunishmentType.KICK:
                        await member.kick("Detected bad word").catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been kicked from the server.\n> Reason: Detected bad words\n> Action Taken: Kick`
                        }).catch(() => { });
                        break;
                    case PunishmentType.MUTE:
                        await member.timeout(5 * 60 * 1000, "Detected bad word").catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been muted for 5 minutes.\n> Reason: Detected bad words\n> Action Taken: Mute`
                        }).catch(() => { });
                        break;
                    case PunishmentType.WARN:
                        await this.warn(message.guild, member.user, client);
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been warned.\n> Reason: Detected bad words\n> Action Taken: Warn`
                        }).catch(() => { });
                        break;
                }
            }
        } catch (error) {
            console.error("Error handling bad word:", error);
        }
    }
    private static async warn(guild: Guild | null, user: User | null, client: Navi): Promise<void> {
        if (!guild || !user) return;
        const data = await client.prisma.punishment.findFirst({
            where: {
                guildId: guild.id,
                userId: user.id
            }
        });
        if (data) {
            await client.prisma.punishment.update({
                where: {
                    id: data.id
                },
                data: {
                    type: PunishmentType.WARN,
                    reason: "Detected bad word",
                    active: true,
                    createdAt: Date.now(),
                }
            });
        } else {
            await client.prisma.punishment.create({
                data: {
                    type: PunishmentType.WARN,
                    reason: "Detected bad word",
                    active: true,
                    createdAt: Date.now(),
                    guildId: guild.id,
                    userId: user.id
                }
            });
        }
    }
    private static async handleToxicity(message: Message, punishment: PunishmentType, client: Navi): Promise<void> {
        try {
            const member = await message.guild?.members.fetch(message.author.id);
            if (member) {
                switch (punishment) {
                    case PunishmentType.NONE:
                        message.delete().catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` detected toxicity.\n> Reason: Detected toxicity\n> Toxicity Threshold: ${this.toxicityThreshold}%\n> Action Taken: None`
                        }).catch(() => { });
                        break;
                    case PunishmentType.BAN:
                        await member.ban({ reason: "Detected toxicity" }).catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been banned from the server.\n> Reason: Detected toxicity\n> Toxicity Threshold: ${this.toxicityThreshold}%\n> Action Taken: Ban`
                        }).catch(() => { });
                        break;
                    case PunishmentType.KICK:
                        await member.kick("Detected toxicity").catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been kicked from the server.\n> Reason: Detected toxicity\n> Toxicity Threshold: ${this.toxicityThreshold}%\n> Action Taken: Kick`
                        }).catch(() => { });
                        break;
                    case PunishmentType.MUTE:
                        await member.timeout(5 * 60 * 1000, "Detected toxicity").catch(() => { });
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been muted for 5 minutes.\n> Reason: Detected toxicity\n> Toxicity Threshold: ${this.toxicityThreshold}%\n> Action Taken: Mute`
                        }).catch(() => { });
                        break;
                    case PunishmentType.WARN:
                        await this.warn(message.guild, member.user, client);
                        message.channel.send({
                            content: `${message.author} \`(${message.author.id})\` has been warned.\n> Reason: Detected toxicity\n> Toxicity Threshold: ${this.toxicityThreshold}%\n> Action Taken: Warn`
                        }).catch(() => { });
                        break;
                }
            }
        } catch (error) {
            console.error("Error handling toxicity:", error);
        }
    }
}