import { Guild, Logger } from "@prisma/client";

enum logType {
    ServerUpdate = "serverUpdate",
    MessageDelete = "messageDelete",
    BulkMessageDelete = "bulkMessageDelete",
    MessageEdit = "messageEdit",
    MemberJoin = "memberJoin",
    MemberLeave = "memberLeave",
    MemberUpdate = "memberUpdate",
    MemberRoleAdd = "memberRoleAdd",
    MemberRoleRemove = "memberRoleRemove",
    MembersNicknameUpdate = "membersNicknameUpdate",
    MemberUsernameUpdate = "memberUsernameUpdate",
    MemberAvatarUpdate = "memberAvatarUpdate",
    MemberBan = "memberBan",
    MemberUnban = "memberUnban",
    MemberKick = "memberKick",
    ChannelCreate = "channelCreate",
    ChannelDelete = "channelDelete",
    ChannelUpdate = "channelUpdate",
    ChannelPinsUpdate = 'channelPinUpdate',
    EmojiCreate = "emojiCreate",
    EmojiDelete = "emojiDelete",
    EmojiUpdate = "emojiUpdate",
    InviteCreate = "inviteCreate",
    InviteDelete = "inviteDelete",
    RoleCreate = "roleCreate",
    RoleDelete = "roleDelete",
    RoleUpdate = "roleUpdate",
    VoiceJoin = "voiceJoin",
    VoiceLeave = "voiceLeave",
    VoiceMove = "voiceMove",
    VoiceServerDeafen = "voiceServerDeafen",
    VoiceServerMute = "voiceServerMute",
    VoiceDeafen = "voiceDeafen",
    VoiceStream = "voiceStream",
    threadCreate = "threadCreate",
    threadDelete = "threadDelete",
    threadUpdate = "threadUpdate",
    threadListSync = "threadListSync",
    threadMemberUpdate = "threadMemberUpdate",
    threadMembersUpdate = "threadMembersUpdate",


}
export { Servers } from "./servers.js";

export {
    Guild,
    logType,
    Logger
}