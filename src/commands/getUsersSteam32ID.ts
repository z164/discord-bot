import {Message} from 'discord.js';

import {IUser} from '../entities/User';

import {THEMES, parse} from './util/logUtilities';
import getUserFromMention from './util/getUserFromMention';
import loggerService from '../services/loggerService';

export default async (message: Message): Promise<void> => {
    loggerService.title('Get');
    let user: IUser;
    try {
        user = await getUserFromMention(message);
    } catch {
        return;
    }
    loggerService.log(
        `${parse(user.nickname, THEMES.NICKNAME_STYLE)}'s Steam ID is ${parse(
            String(user.steam32ID),
            THEMES.NICKNAME_STYLE
        )}`
    );
    loggerService.separator();
    message.channel.send(`${user.nickname}'s Steam ID is ${user.steam32ID}`);
};
