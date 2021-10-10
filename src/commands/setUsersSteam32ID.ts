import {Message} from 'discord.js';

import User from '../repository/User';

import {parse, THEMES} from './util/logUtilities';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';
import steam32IDService from '../services/steam32IDService';

// import fetch64ID from './util/fetch64ID';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Set');
    discordService.isAdmin(message);
    body.shift();
    const bodyStr = body.join(' ').trim();
    steam32IDService.isSteam32IDExists(message, bodyStr);
    const steam32ID = steam32IDService.validateSteam32ID(message, bodyStr);
    const user = await discordService.getUserFromMention(message);
    const res = await User.updateOne(
        {guildID: user.guildID, discordID: user.discordID},
        {steam32ID}
    );
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
};
