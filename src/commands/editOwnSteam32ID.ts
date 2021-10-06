import {Message} from 'discord.js';

import User from '../repository/User';

import loggerService from '../services/loggerService';
import discordService from '../services/discordService';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Edit');
    const bodyStr = body.join(' ').trim();
    const user = await discordService.getAuthorAsUser(message);
    discordService.isSteam32IDExists(message, bodyStr);
    const steam32ID = discordService.validateSteam32ID(message, bodyStr);
    if (!user.canEdit) {
        loggerService.error('User that invoked this command is banned from editing his Steam ID');
        loggerService.separator();
        await discordService.sendMessage(message, 'You were banned from editing your Steam ID');
        return;
    }
    await User.updateOne({discordID: user.discordID, guildID: user.guildID}, {steam32ID});
    loggerService.log('Steam ID successfully updated');
    loggerService.separator();
    await discordService.sendMessage(message, 'Your Steam ID was updated successfully');
};
