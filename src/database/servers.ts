import { Welcome, Guild, Logger, LogChannel } from "@prisma/client";
import { TextChannel, User } from "discord.js";
import { logType } from "./index.js";
import prisma from "../structures/Prisma.js";

export class Servers {
    public static async get(id: string): Promise<Guild> {
        const server = await prisma.guild.findFirst({
            where: {
                guildId: id
            }
        });
        return server;
    }

    public static async setLogger(id: string, userId: string, types: string[], channelId: string, color: string): Promise<void> {
        const server = await prisma.guild.findUnique({
            where: {
                guildId: id,
            },
        });

        const existingChannels = await prisma.logChannel.findMany({
            where: {
                guildId: id,
                type: {
                    hasEvery: types,
                },
            },
        });

        await Promise.all(
            existingChannels.map(async (logChannel) => {
                const filteredType = logChannel.type.filter((t) => !types.includes(t));
                await prisma.logChannel.update({
                    where: {
                        id: logChannel.id,
                    },
                    data: {
                        type: {
                            set: filteredType,
                        },
                    },
                });
            })
        );

        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    logger: {
                        create: {
                            LogChannel: {
                                create: {
                                    guildId: id,
                                    textId: channelId,
                                    type: {
                                        set: types,
                                    },
                                    mode: true,
                                    moderator: userId,
                                    color: color,
                                },
                            },
                        },
                    },
                },
            });
        } else {
            const logChannel = await prisma.logChannel.findFirst({
                where: {
                    guildId: id,
                    textId: channelId,
                },
            });

            if (logChannel) {
                const newTypes = types.filter((t) => !logChannel.type.includes(t));
                const updatedTypes = [...logChannel.type, ...newTypes.filter(Boolean)];

                await prisma.logChannel.update({
                    where: {
                        id: logChannel.id,
                    },
                    data: {
                        type: {
                            set: updatedTypes,
                        },
                    },
                });
            } else {
                await prisma.logChannel.create({
                    data: {
                        guildId: id,
                        textId: channelId,
                        type: {
                            set: types,
                        },
                        mode: true,
                        moderator: userId,
                        color: color,
                    },
                });
            }
        }
    }

    public static async toggleLogger(id: string, userId: string, types: string[], channelId: string, toggle: boolean): Promise<void> {
        const server = await this.get(id);
        const existingChannels = await prisma.logChannel.findMany({
            where: {
                guildId: id,
                type: {
                    hasEvery: types
                },
            },
        });
        await Promise.all(
            existingChannels.map(async (logChannel) => {
                await prisma.logChannel.update({
                    where: {
                        id: logChannel.id,
                    },
                    data: {
                        mode: toggle,
                    },
                });
            })
        );

        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    logger: {
                        create: {
                            LogChannel: {
                                create: {
                                    guildId: id,
                                    textId: channelId,
                                    type: types,
                                    mode: toggle,
                                    moderator: userId,
                                }
                            }
                        }
                    }
                }
            });
        } else {
            const logChannel = await prisma.logChannel.findFirst({
                where: {
                    guildId: id,
                    textId: channelId,
                },
            });

            if (logChannel) {
                await prisma.logChannel.update({
                    where: {
                        id: logChannel.id,
                    },
                    data: {
                        mode: toggle,
                    },
                });
            } else {
                await prisma.logChannel.create({
                    data: {
                        guildId: id,
                        textId: channelId,
                        type: types,
                        mode: toggle,
                        moderator: userId,
                    }
                })
            }
        }
    }

    public static async clearLogger(id: string, channelId: string): Promise<void> {
        const server = await this.get(id);
        if (!server) {
            return;
        }
        const logChannel = await prisma.logChannel.findFirst({
            where: {
                guildId: id,
                textId: channelId,
            },
        });

        if (logChannel) {
            await prisma.logChannel.delete({
                where: {
                    id: logChannel.id,
                },
            });
        }
    }
    public static async getLogger(id: string, type: logType): Promise<any> {
        const server = await this.get(id);
        if (!server) {
            return null;
        }
        const logger = await prisma.logChannel.findFirst({
            where: {
                guildId: id,
                mode: true,
                type: {
                    has: type
                }
            },
        });

        return logger;
    }

    public static async getWelcome(id: string): Promise<Welcome> {
        const server = await this.get(id);
        if (!server) {
            return null;
        }
        const welcome = await prisma.welcome.findFirst({
            where: {
                guildId: id,
            },
        });

        return welcome;
    }

    public static async setWelChannel(id: string, userId: string, channelId: string): Promise<void> {
        const server = await this.get(id);
        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    welcome: {
                        create: {
                            welcomeChannel: channelId,
                            welcomeToggle: true,
                            moderator: userId,
                        }
                    }
                }
            });
        } else {
            const welcome = await prisma.welcome.findFirst({
                where: {
                    guildId: id,
                },
            });

            if (welcome) {
                await prisma.welcome.update({
                    where: {
                        id: welcome.id,
                    },
                    data: {
                        welcomeChannel: channelId,
                        welcomeToggle: true,
                        moderator: userId,
                    },
                });
            } else {
                await prisma.welcome.create({
                    data: {
                        guildId: id,
                        welcomeChannel: channelId,
                        welcomeToggle: true,
                        moderator: userId,
                    }
                })
            }
        }
    }

    public static async setWelMessage(id: string, userId: string, message: string): Promise<void> {
        const server = await this.get(id);
        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    welcome: {
                        create: {
                            welcomeMesage: message,
                            moderator: userId,
                        }
                    }
                }
            });
        } else {
            const welcome = await prisma.welcome.findFirst({
                where: {
                    guildId: id,
                },
            });

            if (welcome) {
                await prisma.welcome.update({
                    where: {
                        id: welcome.id,
                    },
                    data: {
                        welcomeMesage: message,
                        moderator: userId,
                    },
                });
            } else {
                await prisma.welcome.create({
                    data: {
                        guildId: id,
                        welcomeMesage: message,
                        moderator: userId,
                    }
                })
            }
        }
    }

    public static async setWelToggle(id: string, userId: string, toggle: boolean): Promise<void> {
        const server = await this.get(id);
        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    welcome: {
                        create: {
                            welcomeToggle: toggle,
                            moderator: userId,
                        }
                    }
                }
            });
        } else {
            const welcome = await prisma.welcome.findFirst({
                where: {
                    guildId: id,
                },
            });

            if (welcome) {
                await prisma.welcome.update({
                    where: {
                        id: welcome.id,
                    },
                    data: {
                        welcomeToggle: toggle,
                        moderator: userId,
                    },
                });
            } else {
                await prisma.welcome.create({
                    data: {
                        guildId: id,
                        welcomeToggle: toggle,
                        moderator: userId,
                    }
                })
            }
        }
    }

    public static async toggleType(id: string, userId: string, options: wlType): Promise<void> {
        const server = await this.get(id);
        const toggleField = options.isEmbed ? 'welcomeEmbedToggle' : 'welcomeMessageToggle';
        const data = { [toggleField]: true, moderator: userId };

        if (!server) {
            await prisma.guild.create({
                data: {
                    guildId: id,
                    welcome: { create: data }
                }
            });
        } else {
            const welcome = await prisma.welcome.findFirst({ where: { guildId: id } });

            if (welcome) {
                await prisma.welcome.update({ where: { id: welcome.id }, data });
            } else {
                await prisma.welcome.create({ data: { guildId: id, ...data } });
            }
        }
    }


    public static async setWelEmbed(id: string, userId: string, options: wlEmbed): Promise<void> {
        const server = await this.get(id);
        const toggleField = options.title !== undefined ? 'title' : options.titleUrl !== undefined ? 'titleUrl' : options.description !== undefined ? 'description' : options.color !== undefined ? 'color' : options.image !== undefined ? 'image' : options.thumbnail !== undefined ? 'thumbnail' : options.footer !== undefined ? 'footer' : options.footerIcon !== undefined ? 'footerIcon' : options.author !== undefined ? 'author' : options.authorUrl !== undefined ? 'authorUrl' : options.authorIcon !== undefined ? 'authorIcon' : options.timestamp !== undefined ? 'timestamp' : null;

        if (toggleField) {
            const data: any = {
                guildId: id,
                moderator: userId,
            };
            if (options[toggleField] !== undefined) {
                data[toggleField] = options[toggleField];
            }
            if (!server) {
                await prisma.guild.create({
                    data: {
                        guildId: id,
                        welcome: { create: data }
                    }
                });
            } else {
                const welcome = await prisma.welcomeEmbed.findFirst({ where: { guildId: id } });
                if (welcome) {
                    await prisma.welcomeEmbed.update({ where: { id: welcome.id }, data });
                } else {
                    await prisma.welcomeEmbed.create({ data });
                }
            }
        }
    }
}


interface wlType {
    isEmbed?: boolean;
    isMessage?: boolean;
}

interface wlEmbed {
    title?: string;
    titleUrl?: string;
    description?: string;
    color?: string;
    image?: string;
    thumbnail?: string;
    footer?: string;
    footerIcon?: string;
    author?: string;
    authorUrl?: string;
    authorIcon?: string;
    timestamp?: boolean;
}