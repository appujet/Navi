import YouTubeNotification from "../../modules/notification/YouTube.js";
import { Event, Navi } from "../../structures/index.js";
import { ActivityType } from "discord.js";

export default class Ready extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "ready"
        });
    }
    public async run(): Promise<void> {
        this.client.logger.success(`${this.client.user?.tag} is ready!`);

        this.client.user?.setActivity({
            name: "beta 1.0.0",
            type: ActivityType.Streaming,
            shardId: 0,
        });
    }
};

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */