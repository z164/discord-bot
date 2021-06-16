import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import { Message } from 'discord.js';

import { parse, title, themes, separator } from './util/logUtilities';

export default async (message: Message, body: string[]) => {
    title('Set');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Set was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    if (!message.mentions.users.first()) {
        console.log(parse('No user was mentioned', themes.error));
        console.log(separator);
        message.channel.send('No user mentioned');
        return;
    }
    body.shift();
    const bodyStr = body.join(' ').trim();
    let idToSet = message.mentions.users.first().id;
    if (idToSet === message.guild.ownerID) {
        console.log(parse("Mentioned user is a guild owner. Using bot's id to proceed", themes.warning));
        idToSet = message.guild.me.id;
    }
    const guildObj = await GuildModel.findOne({
        guildID: message.guild.id,
    });
    try {
        const res = await UserModel.findOneAndUpdate(
            {
                guildID: guildObj._id,
                discordID: idToSet,
            },
            {
                dotaNickname: bodyStr,
            }
        );
        if (res === null) {
            console.log(parse('Mentioned user is not registered in system', themes.error));
            console.log(separator);
            message.channel.send('This user is not registered in system');
        } else {
            console.log(
                parse(
                    `Changed ${parse(res.nickname, themes.nicknameStyle)}'s Dota 2 nickname to ${parse(
                        bodyStr,
                        themes.nicknameStyle
                    )}`,
                    themes.log
                )
            );
            console.log(separator);
            message.channel.send(`Changed ${res.nickname}'s Dota 2 nickname to ${bodyStr}`);
        }
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
};
