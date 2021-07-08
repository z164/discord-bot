import {Message} from 'discord.js';

import {IUser} from '../entities/User';

import {title, themes, parse, separator} from './util/logUtilities';
import getUserFromMention from './util/getUserFromMention';

export default async (message: Message) => {
    title('Get');
    let user: IUser;
    try {
        user = await getUserFromMention(message);
    } catch {
        return;
    }
    console.log(
        parse(
            `${parse(user.nickname, themes.nicknameStyle)}'s Steam ID is ${parse(
                String(user.steam32ID),
                themes.nicknameStyle
            )}`,
            themes.log
        )
    );
    console.log(separator);
    message.channel.send(`${user.nickname}'s Steam ID is ${user.steam32ID}`);
};
