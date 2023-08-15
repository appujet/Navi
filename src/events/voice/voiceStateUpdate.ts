import { VoiceState, AuditLogEvent } from 'discord.js';
import { Event, Navi, ClientLogger } from '../../structures/index.js';
import { Servers, logType } from '../../database/index.js';


export default class VoiceStateUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "voiceStateUpdate",
        });
    }
    public async run(oldState: VoiceState, newState: VoiceState): Promise<any> {
        try {
            const newMember = newState.guild.members.cache.get(newState.id);
            const channel = newState.guild.channels.cache.get(newState.channel?.id ?? newState.channelId);
            if (newState.id == this.client.user.id) return;

            if (oldState.serverDeaf != newState.serverDeaf) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceServerDeafen);
                if (!log) return
                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setDescription(`${this.client.emo.deafen} just got a voice server ${newState.serverDeaf ? '' : 'un'}deafen`)
                    .addFields(
                        { name: "Member", value: `${newMember} (${newMember.id})`, inline: false },
                        { name: "Channel", value: `${channel} (${channel.id})`, inline: false },
                        { name: "Deafen", value: `${newState.serverDeaf ? '' : 'un'}deafen`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

            if (!oldState.channel && newState.channel) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceJoin);
                if (!log) return
                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setThumbnail(newMember.user.displayAvatarURL({}))
                    .setDescription(`${this.client.emo.join} ${newMember} just joined a voice channel`)
                    .addFields(
                        { name: "Channel", value: `${newState.channel} (${newState.channelId})`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

            if (oldState.channel && !newState.channel) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceLeave);
                if (!log) return

                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setThumbnail(newMember.user.displayAvatarURL({}))
                    .setDescription(`${this.client.emo.leave} ${newMember} just left a voice channel`)
                    .addFields(
                        { name: "Channel", value: `${oldState.channel} (${oldState.channelId})`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

            if (oldState.channel && newState.channel) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceMove);
                if (!log) return
                if (oldState.channelId === newState.channelId) return;
                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setThumbnail(newMember.user.displayAvatarURL({}))
                    .setDescription(`${this.client.emo.move} ${newMember.user.tag} just moved to a voice channel`)
                    .addFields(
                        { name: "Old Channel", value: `${oldState.channel} (${oldState.channelId})`, inline: false },
                        { name: "New Channel", value: `${newState.channel} (${newState.channelId})`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

            if (oldState.serverMute != newState.serverMute) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceServerMute);
                if (!log) return
                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setDescription(`${this.client.emo.mute} just got a server ${newState.serverMute ? '' : 'un'}muted`)
                    .addFields(
                        { name: "Member", value: `${newMember} (${newMember.id})`, inline: false },
                        { name: "Channel", value: `${channel} (${channel.id})`, inline: false },
                        { name: "Server Mute", value: `${newState.serverMute ? '' : 'un'}muted`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldState.streaming != newState.streaming) {
                const log = await Servers.getLogger(newState.guild.id, logType.VoiceStream);
                if (!log) return

                const embed = this.client.embed()
                    .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({}) })
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setDescription(`${this.client.emo.stream} just started streaming`)
                    .addFields(
                        { name: "Member", value: `${newMember} (${newMember.id})`, inline: false },
                        { name: "Channel", value: `${channel} (${channel.id})`, inline: false },
                        { name: "Streaming", value: `${newState.streaming ? "Yes" : "No"}`, inline: false },
                        { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: false },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })

                await ClientLogger.sendWebhook(this.client, newState.guild.id, log.textId, {
                    embeds: [embed]
                });
            }

        } catch (err) {
            console.log(err);
        }
    }
}