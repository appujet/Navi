import { Events } from "discord.js";
import { Navi } from "../../structures/index.js";
import BadWord from "./badWord.js";


export default class AutoMod {
    public client: Navi
    constructor(cliient: Navi) {
        this.client = cliient;
    }
    public async start() {
        this.client.on(Events.MessageCreate, async (message) => {
            await BadWord.check(this.client, message)
            //this.client.logger.info(`AutoMod: BadWord check ran for ${message.author.tag} in ${message.guild?.name}`)
        })
    }
}