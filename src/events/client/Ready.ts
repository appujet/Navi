import YouTubeNotification from "../../modules/notification/YouTube.js";
import { Event, Navi } from "../../structures/index.js";
import { ActivityType, ActivityOptions } from "discord.js";


export default class Ready extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "ready"
        });
    }
    public async run(): Promise<void> {
        this.client.logger.success(`${this.client.user?.tag} is ready!`);
        this.client.user?.setActivity({
            name: "Beta 1.0.0",
            type: ActivityType.Listening,
        });
        new YouTubeNotification(this.client).start().catch(() => { });
    }
}
