import {Message} from 'discord.js';

import {THEMES, parse} from './util/logUtilities';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';

export default async (message: Message): Promise<void> => {
    loggerService.title('Get');
    const user = await discordService.getUserFromMention(message);
    loggerService.log(
        `${parse(user.nickname, THEMES.NICKNAME_STYLE)}'s Steam ID is ${parse(
            String(user.steam32ID),
            THEMES.NICKNAME_STYLE,
        )}`,
    );
    loggerService.separator();
    await discordService.sendMessage(message, `${user.nickname}'s Steam ID is ${user.steam32ID}`);
};
