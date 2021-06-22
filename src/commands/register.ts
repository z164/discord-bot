import {Message} from 'discord.js';
import {IGuild} from '../entities/Guild';

import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import {parse, title, themes, separator} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';
import fetch64ID from './util/fetch64ID';

export default async (message: Message, body: string[]) => {
    title('Register');
    let discordID = message.member.user.id;
    let steam32ID: string | false | number = body.join(' ').trim();
    const nickname = message.member.nickname ?? message.member.user.username;
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
    if (steam32ID === '') {
        console.log(parse('No Steam32 ID provided', themes.error));
        console.log(separator);
        message.channel.send('No Steam32 ID provided');
        return;
    }
    steam32ID = validateSteam32ID(steam32ID);
    if (!steam32ID) {
        console.log(parse('Bad ID provided', themes.error));
        console.log(separator);
        message.channel.send('Please provide valid Steam32 ID');
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
            steam32ID: steam32ID,
            steam64ID: await fetch64ID(steam32ID),
            canEdit: true,
        },
        (err: Error) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    parse(
                        `${parse(nickname, themes.nicknameStyle)} registered successfully with id ${parse(
                            String(steam32ID),
                            themes.nicknameStyle
                        )}`,
                        themes.log
                    )
                );
                console.log(separator);
                message.channel.send(
                    `Registered successfully:\nID: ${discordID}\nGuildID: ${guildObj.guildID}\nNickname: ${nickname}\nSteam32ID: ${steam32ID}`
                );
            }
        }
    );
};
