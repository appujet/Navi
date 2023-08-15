import { ButtonStyle } from "discord.js";

const logType1 = [
    {
        label: "Server Events",
        style: ButtonStyle.Primary,
        customId: "server"
    },
    {
        label: "Message Events",
        style: ButtonStyle.Primary,
        customId: "message"
    },
    {
        label: "Member Events",
        style: ButtonStyle.Primary,
        customId: "member"
    },
    {
        label: "Channel Events",
        style: ButtonStyle.Primary,
        customId: "channel"
    },
    {
        label: "Role Events",
        style: ButtonStyle.Primary,
        customId: "role"
    }
];

const LogType2 = [
    {
        label: "Voice Events",
        style: ButtonStyle.Primary,
        customId: "voice"
    },
    {
        label: "Thread Events",
        style: ButtonStyle.Primary,
        customId: "thread"
    }
];

const wlcType = [
    {
        label: "Message",
        style: ButtonStyle.Primary,
        customId: "message"
    },
    {
        label: "Embed",
        style: ButtonStyle.Primary,
        customId: "embed"
    }
];

const configType = [
    {
        label: "Channel",
        style: ButtonStyle.Primary,
        customId: "channel"
    },
    {
        label: "Title",
        style: ButtonStyle.Primary,
        customId: "title"
    },
    {
        label: "Description",
        style: ButtonStyle.Primary,
        customId: "description"
    },
    {
        label: "Color",
        style: ButtonStyle.Primary,
        customId: "color"
    },
    {
        label: "Image",
        style: ButtonStyle.Primary,
        customId: "image"
    },

];

const configType2 = [
    {
        label: "Thumbnail",
        style: ButtonStyle.Primary,
        customId: "thumbnail"
    },
    {
        label: "Footer",
        style: ButtonStyle.Primary,
        customId: "footer"
    },
    {
        label: "Author",
        style: ButtonStyle.Primary,
        customId: "author"
    },
    {
        label: "Message",
        style: ButtonStyle.Primary,
        customId: "message"
    },
    {
        label: "Embed",
        style: ButtonStyle.Primary,
        customId: "embed"
    },
]

const yesSkip = [
    {
        label: "Yes",
        style: ButtonStyle.Success,
        customId: "Lyes"
    },
    {
        label: "Skip",
        style: ButtonStyle.Primary,
        customId: "Lskip"
    }
]


export {
    logType1,
    LogType2,
    wlcType,
    configType,
    configType2,
    yesSkip
}