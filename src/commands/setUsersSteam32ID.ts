import {Message} from 'discord.js';

import {IUser} from '../entities/User';

import User from '../repository/User';

import {parse, THEMES} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';
import getUserFromMention from './util/getUserFromMention';
import loggerService from '../services/loggerService';

// import fetch64ID from './util/fetch64ID';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Set');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        loggerService.error('Set was invoked by non-administrator user');
        loggerService.separator();
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    body.shift();
    const bodyStr = body.join(' ').trim();
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        loggerService.error('Bad ID provided');
        loggerService.separator();
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
        const res = await User.updateOne({guildID: user.guildID, discordID: user.discordID}, {steam32ID: steam32ID});
        if (res === null) {
            loggerService.error('Mentioned user is not registered in system');
            loggerService.separator();
            message.channel.send('This user is not registered in system');
        } else {
            loggerService.log(
                `Changed ${parse(res.nickname, THEMES.NICKNAME_STYLE)}'s Steam32 ID to ${parse(
                    bodyStr,
                    THEMES.NICKNAME_STYLE
                )}`
            );
            loggerService.separator();
            message.channel.send(`Changed ${res.nickname}'s Steam32 ID to ${bodyStr}`);
        }
    } catch (err) {
        console.log(err);
    }
};
