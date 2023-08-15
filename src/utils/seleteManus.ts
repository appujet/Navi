import { logType } from "../database/index.js";


const mLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Message Delete",
                value: logType.MessageDelete
            },
            {
                label: "Message Edit",
                value: logType.MessageEdit
            },
            {
                label: "Message Bulk Delete",
                value: logType.BulkMessageDelete
            }
        ],
        maxValues: 3,
        minValues: 1,
    }
];

const mLevl2 = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Member Join",
                value: logType.MemberJoin
            },
            {
                label: "Member Leave",
                value: logType.MemberLeave
            },
            {
                label: "Member Ban",
                value: logType.MemberBan
            },
            {
                label: "Member Unban",
                value: logType.MemberUnban
            },
            {
                label: "Member Kick",
                value: logType.MemberKick
            },
            {
                label: "Member Nickname Change",
                value: logType.MembersNicknameUpdate
            },
            {
                label: "Member Username Change",
                value: logType.MemberUsernameUpdate
            },
            {
                label: "Member Avatar Change",
                value: logType.MemberAvatarUpdate
            },
            {
                label: "Member Role Added",
                value: logType.MemberRoleAdd
            },
            {
                label: "Member Role Removed",
                value: logType.MemberRoleRemove
            }
        ],
        maxValues: 10,
        minValues: 1,
    }
];

const sLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Server Update",
                value: logType.ServerUpdate
            },
            {
                label: "Emoji Create",
                value: logType.EmojiCreate
            },
            {
                label: "Emoji Delete",
                value: logType.EmojiDelete
            },
            {
                label: "Emoji Update",
                value: logType.EmojiUpdate
            }
        ],
        maxValues: 4,
        minValues: 1,
    }
]

const cLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Channel Create",
                value: logType.ChannelCreate,
            },
            {
                label: "Channel Delete",
                value: logType.ChannelDelete,
            },
            {
                label: "Channel Update",
                value: logType.ChannelUpdate,
            },
            {
                label: "Channel Pins Update",
                value: logType.ChannelPinsUpdate,
            }
        ],
        maxValues: 4,
        minValues: 1,
    },
];

const rLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Role Create",
                value: logType.RoleCreate,
            },
            {
                label: "Role Delete",
                value: logType.RoleDelete,
            },
            {
                label: "Role Update",
                value: logType.RoleUpdate,
            }
        ],
        maxValues: 3,
        minValues: 1,
    }
]

const vLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Voice Channel Join",
                value: logType.VoiceJoin,
            },
            {
                label: "Voice Channel Leave",
                value: logType.VoiceLeave,
            }, 
            {
                label: "Voice Move",
                value: logType.VoiceMove,
            },
            {
                label: "Voice Server Deafen",
                value: logType.VoiceServerDeafen,
            },
            {
                label: "Voice Stream",
                value: logType.VoiceStream,
            },
            {
                label: "Voice Server Mute",
                value: logType.VoiceServerMute,
             }
        ],
        maxValues: 6,
        minValues: 1,
    }
]

const tLevl = [
    {
        placeholder: "Select a log type",
        customId: "selectLogType",
        options: [
            {
                label: "Thread Create",
                value: logType.threadCreate,
            },
            {
                label: "Thread Delete",
                value: logType.threadDelete,
            },
            {
                label: "Thread Update",
                value: logType.threadUpdate,
            },
            {
                label: "Thread Member Update",
                value: logType.threadMemberUpdate,
            },
            {
                label: "Thread Members Update",
                value: logType.threadMembersUpdate,
            }
        ],
        maxValues: 5,
        minValues: 1,
    }
]
export {
    mLevl,
    mLevl2,
    sLevl,
    cLevl,
    rLevl,
    vLevl,
    tLevl
}
