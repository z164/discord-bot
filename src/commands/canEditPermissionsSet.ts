import {Message} from 'discord.js';

import User from '../repository/User';
import {IUser} from '../entities/User';

import {THEMES, parse} from './util/logUtilities';
import getUserFromMention from './util/getUserFromMention';
import loggerService from '../services/loggerService';

export default async (message: Message, parameter: boolean): Promise<void> => {
    loggerService.title('Lock / Unlock');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        loggerService.error('Lock / Unlock was invoked by non-administrator user');
        loggerService.separator();
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    let user: IUser;
    try {
        user = await getUserFromMention(message);
    } catch {
        return;
    }
    try {
        const res = await User.updateOne({discordID: user.discordID}, {canEdit: parameter});
        loggerService.log(
            `${parse(res.nickname, THEMES.NICKNAME_STYLE)} ${
                parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'
            }`
        );
        loggerService.separator();
        message.channel.send(
            `${res.nickname} ${parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'}`
        );
    } catch (err) {
        console.error(err);
    }
};
