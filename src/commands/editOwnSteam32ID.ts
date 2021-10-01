import {Message} from 'discord.js';

import {IUser} from '../entities/User';
import User from '../repository/User';

import validateSteam32ID from './util/validateSteam32ID';
import getAuthorAsUser from './util/getAuthorAsUser';
import loggerService from '../services/loggerService';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Edit');
    const bodyStr = body.join(' ').trim();
    let user: IUser;
    try {
        user = await getAuthorAsUser(message);
    } catch {
        return;
    }
    if (bodyStr === '') {
        loggerService.error('No Steam 32ID proveded');
        loggerService.separator();
        message.channel.send('No Steam 32ID provided');
        return;
    }
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        loggerService.error('Bad ID provided');
        loggerService.separator();
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    if (!user.canEdit) {
        loggerService.error('User that invoked this command is banned from editing his Steam ID');
        loggerService.separator();
        message.channel.send('You were banned from editing your Steam ID');
        return;
    }
    try {
        await User.updateOne({discordID: user.discordID, guildID: user.guildID}, {steam32ID: steam32ID});
        loggerService.log('Steam ID successfully updated');
        loggerService.separator();
        message.channel.send('Your Steam ID was updated successfully');
    } catch (err) {
        console.error(err);
    }
};
