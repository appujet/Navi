import { createCanvas, loadImage } from 'canvas';
import { GuildMember, Guild, AttachmentBuilder } from 'discord.js';
import { request } from 'undici';

export class Canvas {
    public static async createWelcomeCard(member: GuildMember, guild: Guild): Promise<Buffer> {
        const canvas = createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await loadImage('https://i.imgur.com/6UyJ6Uz.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
        ctx.font = applyText(canvas, `${member.user.username}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.user.username}!`, canvas.width / 2.5, canvas.height / 1.8);
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);
        return canvas.toBuffer();
    }

    public static async mergeImages(img1: any, img2: any): Promise<any> {
        if (!img1 || !img2) return null;
        try {
        const [image1Buffer, image2Buffer] = await Promise.all([
            request(img1),
            request(img2),
        ]).then(async ([image1Response, image2Response]) => {
            const image1Buffer = await image1Response.body.arrayBuffer();
            const image2Buffer = await image2Response.body.arrayBuffer();
            return [image1Buffer, image2Buffer];
        });

        const [image1, image2] = await Promise.all([loadImage(Buffer.from(image1Buffer)), loadImage(Buffer.from(image2Buffer))]);

        const canvas = createCanvas(image1.width + image2.width, Math.max(image1.height, image2.height))
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image1, 0, 0);
        ctx.drawImage(image2, image1.width, 0, image2.width, image2.height);
        const attachment = new AttachmentBuilder(canvas.toBuffer())
            .setName('image.png')
            .setFile(canvas.toBuffer());
            return attachment;
        } catch (error) {
            console.log(error);
        }
    }
}

function applyText(canvas: any, text: any) {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
}