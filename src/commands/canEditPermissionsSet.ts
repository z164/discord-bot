import {Message} from 'discord.js';

import User from '../repository/User'
import {IUser} from '../entities/User';

import {title, themes, separator, parse} from './util/logUtilities';
import getUserFromMention from './util/getUserFromMention';

export default async (message: Message, parameter: boolean) => {
    title('Lock / Unlock');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Lock / Unlock was invoked by non-administrator user', themes.error));
        console.log(separator);
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
        console.log(
            parse(
                `${parse(res.nickname, themes.nicknameStyle)} ${
                    parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'
                }`,
                themes.log
            )
        );
        console.log(separator);
        message.channel.send(
            `${res.nickname} ${parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'}`
        );
    } catch (err) {
        console.error(err);
    }
};
