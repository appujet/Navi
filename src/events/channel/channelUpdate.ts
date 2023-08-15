import { Event, Navi, ClientLogger } from "../../structures/index.js";
import { GuildChannel, ChannelType, AuditLogEvent, PermissionsBitField, DMChannel, TextChannel } from 'discord.js';
import { Servers, logType } from "../../database/index.js";


export default class ChannelUpdate extends Event {
    constructor(client: Navi, file: string) {
        super(client, file, {
            name: "channelUpdate",
        });
    }

    public async run(oldChannel: GuildChannel | DMChannel, newChannel: GuildChannel): Promise<any> {
        try {
            if (oldChannel.type === ChannelType.DM) return
            const { type, name } = oldChannel;
            const regEx = /^🟢｜ticket([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?$/i;
            if (regEx.test(name)) return;
            const oldCh = oldChannel as TextChannel;
            const newCh = newChannel as TextChannel;
            const cnType = {
                0: 'Text Channel',
                2: 'Voice Channel',
                4: 'Category',
                13: 'Stage Channel',
                5: 'Announcement Channel',
                14: 'Directory Channel',
                15: 'Forum Channel',
                12: 'Private Thread Channel',
                11: 'Public Thread Channel',
                10: 'News Thread Channel',
            }
            const log = await Servers.getLogger(oldChannel.guild.id, logType.ChannelUpdate);
            if (!log) return;
            const audit = await oldChannel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate, limit: 1 });
            const entry = audit.entries.first();
            const user = await this.client.users.fetch(entry.executor.id);

            const icon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` as any;

            if (oldChannel.name !== newChannel.name) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Old Name', value: `${oldChannel.name}`, inline: true },
                        { name: 'New Name', value: `${newChannel.name}`, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(newChannel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(newChannel.createdTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldCh.topic !== newCh.topic) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Old Topic', value: `${oldCh.topic ? oldCh.topic : 'No Topic'}`, inline: true },
                        { name: 'New Topic', value: `${newCh.topic}`, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(newChannel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(newChannel.createdTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldCh.nsfw !== newCh.nsfw) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Old NSFW', value: `${oldCh.nsfw ? 'Yes' : 'No'}`, inline: true },
                        { name: 'New NSFW', value: `${newCh.nsfw ? 'Yes' : 'No'}`, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(newChannel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(newChannel.createdTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldChannel.parentId !== newChannel.parentId) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Old Category', value: `${oldChannel.parent}`, inline: true },
                        { name: 'New Category', value: `${newChannel.parent}`, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(newChannel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(newChannel.createdTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            if (oldCh.rateLimitPerUser !== newCh.rateLimitPerUser) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Old Slowmode', value: `${oldCh.rateLimitPerUser}`, inline: true },
                        { name: 'New Slowmode', value: `${newCh.rateLimitPerUser}`, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(newChannel.createdTimestamp / 1000)}:R> - (<t:${Math.floor(newChannel.createdTimestamp / 1000)}>)`, inline: true },
                    )
                    .setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
            const permDiff = oldChannel.permissionOverwrites.cache.filter(x => {
                if (newChannel.permissionOverwrites.cache.find(y => y.allow.bitfield == x.allow.bitfield) && newChannel.permissionOverwrites.cache.find(y => y.deny.bitfield == x.deny.bitfield)) {
                    return false;
                }
                return true;
            }).concat(newChannel.permissionOverwrites.cache.filter(x => {
                if (oldChannel.permissionOverwrites.cache.find(y => y.allow.bitfield == x.allow.bitfield) && oldChannel.permissionOverwrites.cache.find(y => y.deny.bitfield == x.deny.bitfield)) {
                    return false;
                }
                return true;
            }));

            if (permDiff.size) {
                const embed = this.client.embed()
                    .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: icon })
                    .setDescription(`${this.client.emo.update} ${cnType[type]} Updated **${oldChannel.name}**`)
                    .setColor(log.color ? log.color : this.client.color.red)
                    .setFooter({ text: `Channel ID: ${newChannel.id.toString()}`, iconURL: this.client.user.displayAvatarURL({}) })
                    .setTimestamp();
                for (const permID of permDiff.keys()) {
                    const oldPerm = oldChannel.permissionOverwrites.cache.get(permID) || {} as any;
                    const newPerm = newChannel.permissionOverwrites.cache.get(permID) || {} as any;
                    const oldBitfields = {
                        allowed: oldPerm.allow ? oldPerm.allow.bitfield : 0,
                        denied: oldPerm.deny ? oldPerm.deny.bitfield : 0,
                    };
                    const newBitfields = {
                        allowed: newPerm.allow ? newPerm.allow.bitfield : 0,
                        denied: newPerm.deny ? newPerm.deny.bitfield : 0,
                    };

                    let role: any
                    let member: any
                    if (oldPerm.type === 0 || newPerm.type === 0) {
                        role = newChannel.guild.roles.cache.get(newPerm.id || oldPerm.id);
                    }
                    if (oldPerm.type === 1 || newPerm.type === 1) {
                        member = await newChannel.guild.members.fetch(newPerm.id || oldPerm.id);
                    }
                    embed.addFields(
                        { name: `${role ? role.name : member.user.username}`, value: `${role ? `<@&${role.id}>` : member.user.toString()} \`(ID: ${role ? role.id : member.user.id})\``, inline: true },
                    )
                    if (oldBitfields.allowed !== newBitfields.allowed) {
                        embed.addFields(
                            { name: 'Allowed Permissions', value: `\`${new PermissionsBitField(oldBitfields.allowed).toArray().join(', ') || 'None'}\`\nTo\n\`${new PermissionsBitField(newBitfields.allowed).toArray().join(', ') || 'None'}\``, inline: true },
                        );
                    }

                    if (oldBitfields.denied !== newBitfields.denied) {
                        embed.addFields(
                            { name: 'Denied Permissions', value: `\`${new PermissionsBitField(oldBitfields.denied).toArray().join(', ') || 'None'}\`\nTo\n\`${new PermissionsBitField(newBitfields.denied).toArray().join(', ') || 'None'}\``, inline: true },
                        );
                    }
                    embed.addFields(
                        { name: 'Channel', value: `${oldChannel.toString()} \`${oldChannel.id.toString()}\``, inline: true },
                        { name: 'Updated Time', value: `<t:${Math.floor(Date.now() / 1000)}:R> - (<t:${Math.floor(Date.now() / 1000)}>)`, inline: true },
                    );
                }
                await ClientLogger.sendWebhook(this.client, oldChannel.guild.id, log.textId, {
                    embeds: [embed]
                });
            }
        } catch (err) {
            if (err) return;
        }
    }
}
