import { TextChannel, ChannelType, EmbedBuilder } from 'discord.js';
import { Pool } from 'undici';
import { promisify } from 'util';
import { Navi } from '../../structures/index.js';

interface YoutubeVideo {
    id: string;
    snippet: {
        title: string;
        channelId: string;
        liveBroadcastContent: string;
        publishedAt: string;
        description: string;
        channelTitle: string;
        thumbnails: {
            high: {
                url: string;
            },
            default: {
                url: string;
            },
            medium: {
                url: string;
            }
        }
    };
}

export default class YouTubeNotification {
    private client: Navi;
    private pool: Pool;

    constructor(client: Navi) {
        this.client = client;
        this.pool = new Pool('https://yt.lemnoslife.com');
    }

    public async start() {
        this.client.logger.info('YouTube Notification started');
        setInterval(async () => {
            const youtubeChannels = [{
                "guildId": "973268227314573312",
                "channel": "UCX6OQ3DkcsbYNE6H8uQQuVA",
                "textId": "973268227314573312",
                "isEmbed": true,
                "message": "Just uploaded a new video",
                "role": "@everyone",
            }]
            //await this.client.prisma.youtube.findMany({ where: { mode: true}})
            for (const channel of youtubeChannels) {
                const { channel: youtubeChannelIds, textId, isEmbed, message, role, guildId } = channel;

                const response = await this.pool.request({
                    path: `/noKey/videos?part=snippet&id=${youtubeChannelIds}`,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Discord Bot',
                    },
                });
                const data: { items: YoutubeVideo[] } = await promisify(response.body.json.bind(response.body))();

                if (data.items.length > 0) {
                    const video = data.items[0];
                    const guild = await this.client.guilds.fetch(channel.guildId);
                    const textChannel = textId ? await guild.channels.fetch(textId) : null as any;

                    const channels = guild.channels.cache.filter(
                        (c) => (c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement) && (youtubeChannelIds.length === 0 || youtubeChannelIds.includes(c.id))
                    );
                    for (const [, channel] of channels) {
                        const channelObj = channel as TextChannel;
                        if (channelObj.permissionsFor(guild.members.me).has('SendMessages')) {
                            const messageContent = `${role ? `${role} ` : ''} **${video.snippet.channelTitle}** ${message ? message : 'Just uploaded a new video'}: ${video.snippet.title} https://www.youtube.com/watch?v=${video.id}`;
                            if (isEmbed) {
                                const embed = new EmbedBuilder()
                                    .setAuthor({ name: video.snippet.channelId, iconURL: video.snippet.thumbnails.default.url })
                                    .setTitle(video.snippet.title)
                                    .setURL(`https://www.youtube.com/watch?v=${video.id}`)
                                    .setColor('Red')
                                    .setTimestamp(new Date(video.snippet.publishedAt))
                                    .setFooter({
                                        text: `${video.snippet.liveBroadcastContent === 'live' ? 'YouTube Live' : 'YouTube'}`, iconURL: `https://cdn.discordapp.com/attachments/973268227314573312/1072418125955469312/youtube-footer.png`
                                    })
                                    .setImage(video.snippet.thumbnails.high.url)

                                if (textChannel) {
                                    await textChannel.send({ content: messageContent, embeds: [embed] });
                                } else {
                                    await channelObj.send({ content: messageContent, embeds: [embed] });
                                }
                            } else {
                                if (textChannel) {
                                    await textChannel.send({ content: messageContent });
                                } else {
                                    await channelObj.send({ content: messageContent });
                                }
                            }
                        }
                    }
                }
            }
        }, 1000 * 5); // 5 seconds
    }
    private async getYtChannelList(): Promise<string[]> {
        const youtubeChannels = await this.client.prisma.youtube.findMany({ where: { mode: true } })
        const youtubeChannelIds: any[] = [];
        for (const channel of youtubeChannels) {
            youtubeChannelIds.push(channel.channel);
        }
        return youtubeChannelIds;
    }

    private async getRecentUploads(ytChannelIds: string[]): Promise<YoutubeVideo[]> {
        const response = await this.pool.request({
            path: `/noKey/videos?part=snippet&channelId=${ytChannelIds.join(',')}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Discord Bot',
            },
        });
        const data: { items: YoutubeVideo[] } = await promisify(response.body.json.bind(response.body))();
        return data.items;
    }
    private async getDisChannelList(): Promise<string[]> {
        const youtubeChannels = await this.client.prisma.youtube.findMany({ where: { mode: true } })
        const youtubeChannelIds: any[] = [];
        for (const channel of youtubeChannels) {
            youtubeChannelIds.push(channel);
        }
        return youtubeChannelIds;
    }
    private async sendEmbed(): Promise<void> {
        const ytChannelIds = await this.getYtChannelList();
        const recentUploads = await this.getRecentUploads(ytChannelIds);
        const disChannelIds = await this.getDisChannelList();
        for (const channel of disChannelIds) {
        }
    }

}


