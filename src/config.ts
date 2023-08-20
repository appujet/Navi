import { SearchEngine } from './types.js';
import dotenv from "dotenv";
dotenv.config();

export default {
    token: process.env.TOKEN,
    prefix: "+",
    color: {
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        yellow: 0xffff00,
        main: 0x2F3136,
    },
    searchEngine: SearchEngine.YouTube,
    maxPlaylistSize: 100,
    maxQueueSize: 1000,
    owners: ["959276033683628122"],
    clientId: "841343022193049611",
    guildId: "1086925793906663474",
    production: false,
    lavalink: [{
        url: "localhost:2333",
        auth: "youshallnotpass",
        name: "main",
        secure: false
    }],
    redis: {
        host: "localhost",
        port: 6379,
        db: 0
    },
    links: {
        support: "https://discord.gg/",
        invite: "https://discord.com/oauth2/authorize?client_id=690072976412340254&scope=bot&permissions=8",
        website: process.env.WEBSITE_LINK,
        github: process.env.GITHUB_LINK
    }
}
