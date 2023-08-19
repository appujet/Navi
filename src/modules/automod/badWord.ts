import { Message } from "discord.js";
import badWord from "../../../assets/json/badWords.json" assert { type: "json" };
import Automod  from './Class.js';

export default class BadWord extends Automod {
    public static badWords = badWord;
    public static async check(message: Message): Promise<any> {
        if (message.author.bot) return;
        const words = message.content.split(" ");
        for (const word of words) {
            if (this.badWords.includes(word)) {
                await message.delete();
                return message.channel.send(`${message.author} you cannot say that word!`);
            }
        }
    }
}