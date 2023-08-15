import { Node } from "shoukaku";
import { Navi, Dispatcher } from "./index.js";
import { Guild } from 'discord.js';
export class Queue extends Map {
    public client: Navi;
    constructor(client: Navi) {
        super();
        this.client = client;
    }
    public get(guildId: string): Dispatcher {
        return super.get(guildId);
    }
    public set(guildId: string, dispatcher: Dispatcher) {
        return super.set(guildId, dispatcher);
    }
    public delete(guildId: string) {
        return super.delete(guildId);
    }
    public clear() {
        return super.clear();
    }

    public async create(guild: Guild, voice: any, channel: any, givenNode?: Node) {
        let dispatcher = this.get(guild.id);

        if (!dispatcher) {

            const node = givenNode || this.client.shoukaku.getNode();

            const player = await node.joinChannel({
                guildId: guild.id,
                channelId: voice.id,
                shardId: guild.shard.id,
                deaf: true,
            });

            dispatcher = new Dispatcher({
                client: this.client,
                guildId: guild.id,
                channelId: channel.id,
                player,
                node,
            });

            this.set(guild.id, dispatcher);
            this.client.shoukaku.emit('playerCreate', dispatcher.player);
            return dispatcher;
        }
    }

    public async search(query: string) {
        const node = this.client.shoukaku.getNode();
        const regex = /^https?:\/\//;
        let result: any;
        try {
            result = await node.rest.resolve(regex.test(query) ? query : `${this.client.config.searchEngine}:${query}`);
        } catch (err) {
            return null;
        }
        return result;
    }
};

