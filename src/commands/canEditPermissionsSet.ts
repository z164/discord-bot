import {Message} from 'discord.js';
import UserModel from '../entities/User';
import getUserFromMention from './util/getUserFromMention';

import {title, themes, separator, parse} from './util/logUtilities';

export default async (message: Message, parameter: boolean) => {
    title('Lock / Unlock');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Lock / Unlock was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    const user = await getUserFromMention(message);
    try {
        const res = await UserModel.findOneAndUpdate({discordID: user.discordID}, {canEdit: parameter});
        console.log(
            parse(
                `${parse(res.nickname, themes.nicknameStyle)} ${
                    parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'
                }`,
                themes.log
            )
        );
        message.channel.send(
            `${res.nickname} ${parameter ? 'can now edit his Steam ID' : 'can no longer edit his Steam ID'}`
        );
    } catch (err) {
        console.error(err);
    }
};
