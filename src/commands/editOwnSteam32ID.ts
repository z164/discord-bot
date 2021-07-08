import {Message} from 'discord.js';

import {IUser} from '../entities/User';
import User from '../repository/User';

import {parse, title, themes, separator} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';
import getAuthorAsUser from './util/getAuthorAsUser';

export default async (message: Message, body: string[]) => {
    title('Edit');
    const bodyStr = body.join(' ').trim();
    let user: IUser;
    try {
        user = await getAuthorAsUser(message);
    } catch {
        return;
    }
    if (bodyStr === '') {
        console.log(parse('No Steam 32ID provided', themes.error));
        console.log(separator);
        message.channel.send('No Steam 32ID provided');
        return;
    }
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        console.log(parse('Bad ID provided', themes.error));
        console.log(separator);
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    if (!user.canEdit) {
        console.log(parse('User that invoked this command is banned from editing his Steam ID', themes.error));
        console.log(separator);
        message.channel.send('You were banned from editing your Steam ID');
        return;
    }
    try {
        await User.updateOne({discordID: user.discordID, guildID: user.guildID}, {steam32ID: steam32ID});
        console.log(parse('Steam ID successfully updated', themes.log));
        console.log(separator);
        message.channel.send('Your Steam ID was updated successfully');
    } catch (err) {
        console.error(err);
    }
};
