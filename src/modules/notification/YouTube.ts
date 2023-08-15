import { TextChannel } from 'discord.js';
import { Navi } from '../../structures/index.js';
import Parser from 'rss-parser';
import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';


type ChannelInfoOptions = {
    requestOptions?: AxiosRequestConfig;
};
type AnyObject = Record<string, any>;

type ChannelInfo = {
    name?: string;
    id?: string;
    url?: string;
    rssUrl?: string;
    logo?: Array<any>;
    verified: boolean;
    description?: string;
    subscribers?: string;
    banner?: Array<any>;
    tvBanner?: Array<any>;
    mobileBanner?: Array<any>;
    tags?: Array<string>;
    videos: string;
    unlisted?: boolean;
    familySafe?: boolean;
};
type YoutubeVideo = {
    id?: string;
    title?: string;
    url?: string;
    duration?: string;
    author?: string;
    uploadedAt?: string;
    isoDate?: string;
    isLive?: boolean;
    views?: string;
    thumbnail?: string;
    description?: string;
    private?: boolean;
    unlisted?: boolean;
    premiere?: boolean;
    channel?: ChannelInfo;
    raw?: any;
}

export default class YouTubeNotification {
    private client: Navi;
    private parser: Parser = new Parser();
    private BASE_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=';
    constructor(client: Navi) {
        this.client = client;
    }
    public async start() {
        this.client.logger.info('YouTube Notification started');
        
        setInterval(async () => {
            const youtubeChannels = await this.client.prisma.youtube.findMany({ where: { mode: true } });
            if (!youtubeChannels) return;
            this.send(youtubeChannels);
        }, 5000);
    }
    private async send(data: any[]) {
        await Promise.all(data.map(async (channel) => {
            const guild = await this.client.guilds.fetch(channel.guildId);
            if (!guild) return;
            const textChannel = await guild.channels.fetch(channel.textId) as TextChannel;
            if (!textChannel) return;
            const lastVideo = await this.getLatestVideos(channel.channelId);
            if (!lastVideo) return;

            if (channel.lastVideoId === lastVideo[0].id) return;
            await this.client.prisma.youtube.update({
                where: {
                    channelId: channel.channelId,
                    guildId: channel.guildId
                },
                data: { lastVideoId: lastVideo[0].id }
            });
            const text = {
                video: "just uploaded a new video",
                live: "is now live",
                premiere: "is now premiering"
            }
            const msg = {
                content: `${channel.message.replace('{url}', lastVideo[0].url).replace('{title}', lastVideo[0].title).replace('{author}', lastVideo[0].author).replace('{channel}', lastVideo[0].channel.name).replace('{date}', `<t:${Math.floor(new Date(lastVideo[0].uploadedAt).getTime() / 1000)}:R>`).replace('{role}', channel.role).replace('{text}', text[lastVideo[0].isLive ? 'live' : lastVideo[0].premiere ? 'premiere' : 'video'])}`,
            }
            const embed = this.client.embed()
                .setTitle(lastVideo[0].title)
                .setURL(lastVideo[0].url)
                .setAuthor({ name: lastVideo[0].author, iconURL: lastVideo[0].channel.logo[0].url })
                .setThumbnail(lastVideo[0].channel.logo[0].url)
                .setDescription(lastVideo[0].channel.description.length > 80 ? lastVideo[0].channel.description.slice(0, 80) + '...' : lastVideo[0].channel.description)
                .setImage(lastVideo[0].thumbnail)
                .setFooter({ text: lastVideo[0].channel.name, iconURL: lastVideo[0].channel.banner[0].url })
                .setTimestamp(new Date(lastVideo[0].uploadedAt).getTime());
            if (channel.isEmbed) {
                textChannel.send({ embeds: [embed], content: msg.content });
            } else {
                textChannel.send(msg);
            }
            const updatedYoutubeChannels = await this.client.prisma.youtube.findMany({ where: { mode: true } });
            this.send(updatedYoutubeChannels);
        }));
    }
    public async getLatestVideos(channelLink: string): Promise<YoutubeVideo[]> {
        return new Promise(async (res, rej) => {
            try {
                const channel = await this.getChannelInfo(channelLink);
                let feed = await this.parser.parseURL(this.BASE_URL + channel.id) as any;

                const videoPromises = feed.items.map(async (item) => {
                    const video: YoutubeVideo = {
                        id: item.link.split("watch?v=")[1] || item.id,
                        title: item.title,
                        url: item.link,
                        author: item.author,
                        uploadedAt: item.pubDate,
                        isoDate: item.isoDate,
                        channel: {
                            name: channel.name,
                            id: channel.id,
                            url: channel.url,
                            verified: channel.verified,
                            logo: channel.logo,
                            subscribers: channel.subscribers,
                            description: channel.description,
                            banner: channel.banner,
                            tvBanner: channel.tvBanner,
                            mobileBanner: channel.mobileBanner,
                            unlisted: channel.unlisted,
                            familySafe: channel.familySafe,
                            videos: ""
                        },
                        raw: item,
                    };

                    try {
                        const youtubeInfo = await this.fetchYoutubeInfo(item.link);
                        video.description = youtubeInfo.description;
                        video.isLive = youtubeInfo.isLive;
                        video.premiere = youtubeInfo.premiere;
                        video.thumbnail = youtubeInfo.thumbnail;
                        video.duration = youtubeInfo.duration;
                    } catch (error) {
                        console.error("Error fetching YouTube info:", error);
                    }
                    return video;
                });
                const tLastVideos = (await Promise.all(videoPromises))

                tLastVideos.sort((a, b) => {
                    let aPubDate = new Date(a.uploadedAt || 0).getTime();
                    let bPubDate = new Date(b.uploadedAt || 0).getTime();
                    return bPubDate - aPubDate;
                });
                if (tLastVideos.length === 0) {
                    return rej('No videos found');
                }
                return res(tLastVideos);
            } catch (error) {
                return rej(error);
            }
        });
    }

    public getChannelInfo(channelLink: string): Promise<ChannelInfo> {
        return new Promise(async (res, rej) => {
            try {
                if (!channelLink) rej('No channel link provided');
                const channel = await this.getYtInfo(channelLink);
                if (!channel) rej('No channel found');
                return res(channel);
            } catch (error) {
                return rej(error);
            }
        });
    }
    private async getYtInfo(url: string, options?: ChannelInfoOptions): Promise<ChannelInfo> {
        if (typeof url !== "string")
            throw new Error(`Expected "url" to be "string" but received "${typeof url}".`);
        if (typeof options !== "object") options = {};
        options = this.mergeObj({
            requestOptions: {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
                },
            },
        }, options);
        if (url.startsWith("@")) {
            url = `https://www.youtube.com/${url}`;
        }
        if (!url.startsWith("http"))
            url = `https://www.youtube.com/channel/${url}`;
        let res: string;
        try {
            res = (await axios.get(url, {
                ...options.requestOptions,
                responseType: "text"
            })).data;
        } catch (err) {
            throw new Error(`Failed to fetch site. (${err})`);
        }
        let initialData: any;
        try {
            initialData = JSON.parse(res.split("var ytInitialData = ")[1].split(";</script>")[0]);
        } catch (err) {
            throw new Error(`Failed to parse data from script tag. (${err})`);
        }
        //console.log(initialData);
        const channel: ChannelInfo = {
            name: initialData?.metadata?.channelMetadataRenderer?.title,
            id: initialData?.metadata?.channelMetadataRenderer?.externalId,
            url: initialData?.metadata?.channelMetadataRenderer?.channelUrl,
            rssUrl: initialData?.metadata?.channelMetadataRenderer?.rssUrl,
            description: initialData?.metadata?.channelMetadataRenderer?.description,
            subscribers: initialData?.header?.c4TabbedHeaderRenderer?.subscriberCountText?.simpleText,
            verified: initialData?.header?.c4TabbedHeaderRenderer?.badge?.metadataBadgeRenderer?.tooltip === "Verified",
            banner: initialData?.header?.c4TabbedHeaderRenderer?.banner?.thumbnails?.sort((a: any, b: any) => b.width - a.width),
            tvBanner: initialData?.header?.c4TabbedHeaderRenderer?.tvBanner?.thumbnails?.sort((a: any, b: any) => b.width - a.width),
            mobileBanner: initialData?.header?.c4TabbedHeaderRenderer?.mobileBanner?.thumbnails?.sort((a: any, b: any) => b.width - a.width),
            logo: initialData?.header?.c4TabbedHeaderRenderer?.avatar?.thumbnails?.sort((a: any, b: any) => b.width - a.width),
            tags: initialData?.metadata?.channelMetadataRenderer?.keywords.split(" "),
            videos: "",
            unlisted: initialData?.microformat?.microformatDataRenderer?.unlisted,
            familySafe: initialData?.metadata?.channelMetadataRenderer?.isFamilySafe,
        };

        return channel;
    }
    private fetchYoutubeInfo(url: string): Promise<YoutubeVideo> {
        return new Promise(async (res, rej) => {
            try {
                const response = await axios.get(url);
                const html = response.data;

                const $ = cheerio.load(html);
                const youtubeInfo: YoutubeVideo = {
                    description: $('meta[name="description"]').attr('content'),
                    isLive: Boolean($('meta[itemprop="isLiveBroadcast"]').length),
                    premiere: Boolean($('div.badge.badge-style-type-premiere').length),
                    thumbnail: $('meta[property="og:image"]').attr('content'),
                    duration: $('meta[itemprop="duration"]').attr('content'),
                };
                return res(youtubeInfo);
            } catch (error) {
                return rej(error);
            }
        });
    }
    private merge2Obj(one: AnyObject, two: AnyObject): AnyObject {
        for (const key in two) {
            if (Object.prototype.hasOwnProperty.call(two, key)) {
                const ele = two[key];
                if (typeof ele === "object" && !Array.isArray(ele)) {
                    if (!one[key] || typeof one[key] !== "object") {
                        one[key] = {};
                    }
                    this.merge2Obj(one[key], ele);
                } else {
                    one[key] = ele;
                }
            }
        }
        return one;
    }
    private mergeObj(res: AnyObject, ...objs: AnyObject[]): AnyObject {
        objs.forEach((obj) => this.merge2Obj(res, obj));
        return res;
    };
}

