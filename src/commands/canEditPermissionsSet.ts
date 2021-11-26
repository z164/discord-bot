import {Message} from 'discord.js';

import User from '../repository/User';

import {THEMES, parse} from './util/logUtilities';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';

export default async (message: Message, parameter: boolean): Promise<void> => {
    loggerService.title('Lock / Unlock');
    discordService.isAdmin(message);
    const user = await discordService.getUserFromMention(message);
    const userUpdated = await User.updateOne({discordID: user.discordID}, {canEdit: parameter});
    loggerService.log(
        `${parse(userUpdated.nickname, THEMES.NICKNAME_STYLE)} ${
            parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'
        }`,
    );
    loggerService.separator();
    await discordService.sendMessage(
        message,
        `${userUpdated.nickname} ${
            parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'
        }`,
    );
};
