import { Message } from 'discord.js';
import { IGuild } from '../entities/Guild';

import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import { parse, title, themes, separator } from './utility/logUtilities';

export default async (message: Message, body: string[]) => {
    title('Register');
    let discordID = message.member.user.id;
    const nickname = message.member.nickname ?? message.member.user.username;
    const dotaNickname = body.join(' ').trim();
    const guildID = message.guild.id;
    const guildName = message.guild.name;
    if (message.author.id === message.guild.ownerID) {
        console.log(
            parse(
                `${parse(nickname, themes.nicknameStyle)} is a guild owner. Using bot's id to proceed`,
                themes.warning
            )
        );
        discordID = message.guild.me.id;
    }
    if (dotaNickname === '') {
        console.log(parse('No nickname provided', themes.error));
        console.log(separator);
        message.channel.send('No nickname provided');
        return;
    }
    let guildObj: IGuild;
    const guild = await GuildModel.findOne({
        guildID: guildID,
    });
    guildObj = guild;
    if (!guild) {
        guildObj = await GuildModel.create({
            guildID: guildID,
            name: guildName,
        });
        console.log(parse('Guild did not exist in database, so it was created', themes.warning));
    } else {
        console.log(parse('Guild exists in database', themes.log));
    }
    const user = await UserModel.findOne({
        guildID: guildObj._id,
        discordID: discordID,
    });
    if (user) {
        console.log(parse('User is already registered', themes.error));
        console.log(separator);
        message.channel.send('You are already registered');
        return;
    }
    UserModel.create(
        {
            guildID: guildObj._id,
            discordID: discordID,
            nickname: nickname,
            dotaNickname: dotaNickname,
            canEdit: true,
        },
        (err: Error) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    parse(
                        `${parse(nickname, themes.nicknameStyle)} registered successfully with nickname ${parse(
                            dotaNickname,
                            themes.nicknameStyle
                        )}`,
                        themes.log
                    )
                );
                console.log(separator);
                message.channel.send(
                    `Registered successfully:\nID: ${discordID}\nGuildID: ${guildObj.guildID}\nNickname: ${nickname}\nDota Nickname: ${dotaNickname}`
                );
            }
        }
    );
};
