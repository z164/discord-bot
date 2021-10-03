import {Message} from 'discord.js';

import User from '../repository/User';

import {parse, THEMES} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';

// import fetch64ID from './util/fetch64ID';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Set');
    discordService.isAdmin(message);
    body.shift();
    const bodyStr = body.join(' ').trim();
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        loggerService.error('Bad ID provided');
        loggerService.separator();
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    const user = await discordService.getUserFromMention(message);
    const res = await User.updateOne(
        {guildID: user.guildID, discordID: user.discordID},
        {steam32ID: steam32ID}
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
