import { Event, Navi } from "../../structures/index.js";
import { ThreadChannel, Collection, Snowflake } from "discord.js";

export default class ThreadListSync extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "threadListSync",
        });
    }
    public async run(threads: Collection<Snowflake, ThreadChannel>): Promise<any> {
        try {
            for (const thread of threads) {
                thread.join();
            }
        } catch (error) {
            this.client.logger.error(error);
        }
    }
}