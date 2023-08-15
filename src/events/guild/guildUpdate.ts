import { Event, Navi, Canvas, ClientLogger } from "../../structures/index.js";
import { Guild, AuditLogEvent } from "discord.js";
import { Servers, logType } from "../../database/index.js";


export default class GuildUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "guildUpdate",
        });
    }
    public async run(oldGuild: Guild, newGuild: Guild): Promise<any> {
        try {
            const log = await Servers.getLogger(newGuild.id, logType.ServerUpdate);
            const audit = await newGuild.fetchAuditLogs({ type: AuditLogEvent.GuildUpdate, limit: 1 });
            const entry = audit.entries.first();

            const user = await this.client.users.fetch(entry.executor.id);
            const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            if (!log) return;
            const channel = newGuild.channels.cache.get(log.textId) as any;
            if (!channel) return;
            const embed = this.client.embed()
                .setColor(log.color ? log.color : this.client.color.yellow)
                .setAuthor({ name: user.tag, iconURL: icon })
                .setTitle(`${this.client.emo.update} Server Updated`)
                .setTimestamp()
                .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
            let oldIcon: any = null;

            if (oldGuild.name !== newGuild.name) {
                embed.addFields(
                    { name: "Old Name", value: oldGuild.name, inline: true },
                    { name: "New Name", value: newGuild.name, inline: true },
                )
            }
            if (oldGuild.iconURL({}) !== newGuild.iconURL({})) {
                oldIcon = await Canvas.mergeImages(oldGuild.iconURL({ extension: "png" }), newGuild.iconURL({ extension: "png" }));
                embed.setDescription(`Updated Icon: [Old Icon](${oldGuild.iconURL({})}) | [New Icon](${newGuild.iconURL({})})`)
                    .setImage(`attachment://image.png`)
            }
            if (oldGuild.bannerURL({}) !== newGuild.bannerURL({})) {
                oldIcon = await Canvas.mergeImages(oldGuild.bannerURL({ extension: "png" }), newGuild.bannerURL({ extension: "png" }));
                embed.setDescription(`Updated Banner: [Old Icon](${oldGuild.bannerURL({})}) | [New Icon](${newGuild.bannerURL({})})`)
                    .setImage(`attachment://image.png`)
            }
            if (oldGuild.splashURL({}) !== newGuild.splashURL({})) {
                oldIcon = await Canvas.mergeImages(oldGuild.splashURL({ extension: "png" }), newGuild.splashURL({ extension: "png" }));
                embed.setDescription(`Updated Splash: [Old Icon](${oldGuild.splashURL({})}) | [New Icon](${newGuild.splashURL({})})`)
                    .setImage(`attachment://image.png`)
            }
            if (oldGuild.discoverySplashURL({}) !== newGuild.discoverySplashURL({})) {
                oldIcon = await Canvas.mergeImages(oldGuild.discoverySplashURL({ extension: "png" }), newGuild.discoverySplashURL({ extension: "png" }));
                embed.setDescription(`Updated Discovery Splash: [Old Icon](${oldGuild.discoverySplashURL({})}) | [New Icon](${newGuild.discoverySplashURL({})})`)
                    .setImage(`attachment://image.png`)
            }
            if (oldGuild.description !== newGuild.description) {
                embed.addFields(
                    { name: "Old Description", value: oldGuild.description, inline: true },
                    { name: "New Description", value: newGuild.description, inline: true },
                )
            }
            if (oldGuild.ownerId !== newGuild.ownerId) {
                embed.addFields(
                    { name: "Old Owner", value: `<@${oldGuild.ownerId}>\`(${oldGuild.ownerId})\``, inline: true },
                    { name: "New Owner", value: `<@${newGuild.ownerId}>\`(${newGuild.ownerId})\``, inline: true },
                )
            }
            if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                embed.addFields(
                    { name: "Old Vanity URL", value: `https://discord.gg/${oldGuild.vanityURLCode}`, inline: true },
                    { name: "New Vanity URL", value: `https://discord.gg/${newGuild.vanityURLCode}`, inline: true },
                )
            }
            if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
                embed.addFields(
                    { name: "Old AFK Channel", value: `<#${oldGuild.afkChannelId}>\`(${oldGuild.afkChannelId})\``, inline: true },
                    { name: "New AFK Channel", value: `<#${newGuild.afkChannelId}>\`(${newGuild.afkChannelId})\``, inline: true },
                )
            }
            if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
                embed.addFields(
                    { name: "Old System Channel", value: `<#${oldGuild.systemChannelId}>\`(${oldGuild.systemChannelId})\``, inline: true },
                    { name: "New System Channel", value: `<#${newGuild.systemChannelId}>\`(${newGuild.systemChannelId})\``, inline: true },
                )
            }
            if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
                embed.addFields(
                    { name: "Old Rules Channel", value: `<#${oldGuild.rulesChannelId}>\`(${oldGuild.rulesChannelId})\``, inline: true },
                    { name: "New Rules Channel", value: `<#${newGuild.rulesChannelId}>\`(${newGuild.rulesChannelId})\``, inline: true },
                )
            }
            if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
                embed.addFields(
                    { name: "Old Public Updates Channel", value: `<#${oldGuild.publicUpdatesChannelId}>\`(${oldGuild.publicUpdatesChannelId})\``, inline: true },
                    { name: "New Public Updates Channel", value: `<#${newGuild.publicUpdatesChannelId}>\`(${newGuild.publicUpdatesChannelId})\``, inline: true },
                )
            }
            if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
                embed.addFields(
                    { name: "Old Preferred Locale", value: oldGuild.preferredLocale, inline: true },
                    { name: "New Preferred Locale", value: newGuild.preferredLocale, inline: true },
                )
            }

            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                embed.addFields(
                    { name: "Old Verification Level", value: `${oldGuild.verificationLevel}`, inline: true },
                    { name: "New Verification Level", value: `${newGuild.verificationLevel}`, inline: true },
                )
            }
            if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                embed.addFields(
                    { name: "Old Explicit Content Filter", value: `${oldGuild.explicitContentFilter}`, inline: true },
                    { name: "New Explicit Content Filter", value: `${newGuild.explicitContentFilter}`, inline: true },
                )
            }
            if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
                embed.addFields(
                    { name: "Old MFA Level", value: `${oldGuild.mfaLevel}`, inline: true },
                    { name: "New MFA Level", value: `${newGuild.mfaLevel}`, inline: true },
                )
            }
            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                embed.addFields(
                    { name: "Old Default Message Notifications", value: `${oldGuild.defaultMessageNotifications}`, inline: true },
                    { name: "New Default Message Notifications", value: `${newGuild.defaultMessageNotifications}`, inline: true },
                )
            }
            if (oldGuild.premiumTier !== newGuild.premiumTier) {
                embed.addFields(
                    { name: "Old Premium Tier", value: `${oldGuild.premiumTier}`, inline: true },
                    { name: "New Premium Tier", value: `${newGuild.premiumTier}`, inline: true },
                )
            }
            if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
                embed.addFields(
                    { name: "Old Premium Subscription Count", value: `${oldGuild.premiumSubscriptionCount}`, inline: true },
                    { name: "New Premium Subscription Count", value: `${newGuild.premiumSubscriptionCount}`, inline: true },
                )
            }

            if (channel) {
                let arry = []
                if (oldIcon) arry.push(oldIcon)
                await ClientLogger.sendWebhook(this.client, oldGuild.id, log.textId, {
                    embeds: [embed],
                    files: arry
                });
            }
        } catch (e) {
            if (e) return;
        }
    }
}