import UserModel, {IUser} from '../entities/User';
import GuildModel from '../entities/Guild';

import {Message} from 'discord.js';

import {parse, title, themes, separator} from './util/logUtilities';

import validateSteam32ID from './util/validateSteam32ID';
import fetch64ID from './util/fetch64ID';
import getUserFromMention from './util/getUserFromMention';

export default async (message: Message, body: string[]) => {
    title('Set');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Set was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    body.shift();
    const bodyStr = body.join(' ').trim();
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        console.log(parse('Bad ID provided', themes.error));
        console.log(separator);
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    let user: IUser;
    try {
        user = await getUserFromMention(message);
    } catch {
        return;
    }
    try {
        const res = await UserModel.findOneAndUpdate(
            {guildID: user.guildID, discordID: user.discordID},
            {steam32ID: steam32ID, steam64ID: await fetch64ID(steam32ID)}
        );
        if (res === null) {
            console.log(parse('Mentioned user is not registered in system', themes.error));
            console.log(separator);
            message.channel.send('This user is not registered in system');
        } else {
            console.log(
                parse(
                    `Changed ${parse(res.nickname, themes.nicknameStyle)}'s Steam32 ID to ${parse(
                        bodyStr,
                        themes.nicknameStyle
                    )}`,
                    themes.log
                )
            );
            console.log(separator);
            message.channel.send(`Changed ${res.nickname}'s Steam32 ID to ${bodyStr}`);
        }
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
};
