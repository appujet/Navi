import Navi from "./structures/Navi.js";
import { ClientOptions, Partials } from "discord.js";
import config from "./config.js";

const clientOptions: ClientOptions = {
    intents: 3276799,
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false
    },
    partials: [Partials.GuildMember, Partials.User, Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildScheduledEvent],

}
const client = new Navi(clientOptions);

client.start(config.token);
