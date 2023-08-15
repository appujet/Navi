/* eslint-disable @typescript-eslint/no-unused-vars */
import type Prisma from "prisma";
import { PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";
import superjson from "superjson";
import Logger from "./Logger.js";
import config from "../config.js";

const logger = new Logger();
const redis = new Redis(config.redis);
redis.on("error", (error) => {
    logger.error(error);
});
redis.on("ready", () => {
    logger.start("Redis is ready");
});
redis.on("connect", () => {
    logger.success("Redis is connected");
});
redis.on("reconnecting", () => {
    logger.warn("Redis is reconnecting");
});
redis.on("end", () => {
    logger.warn("Redis connection has ended");
});
const prisma = new PrismaClient();

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 } } },
    cacheTime: 300,
    models: [
        { model: "Guild", cacheTime: 180 },
        { model: "Dj", cacheTime: 180 },
        { model: "Roles", cacheTime: 180 },
        { model: "User", cacheTime: 180 },
        { model: "Playlist", cacheTime: 180 },
        { model: "Premium", cacheTime: 180 },
        { model: "Logger", cacheTime: 180 },
        { model: "LogChannel", cacheTime: 180 },
        { model: "Youtube", cacheTime: 1 },
        { model: "Welcome", cacheTime: 180 },
        { model: "welcomeEmbed", cacheTime: 180 },
        { model: "leaveEmbed", cacheTime: 180 },
        { model: "welcomeRole", cacheTime: 180 },
        { model: "Ban", cacheTime: 180 },
    ],
    transformer: {
        serialize: (result) => superjson.serialize(result),
        deserialize: (serialized) => superjson.deserialize(serialized),
    },
    /* onHit: (key) => {
        logger.info("Cache hit" + key);
    },
    onMiss: (key) => {
        logger.log("Cache miss" + key);
    },
    onError: (key) => {
        logger.error("Cache error" + key);
    } */
});

prisma.$use(cacheMiddleware);

export default prisma;
