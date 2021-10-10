import {Message} from 'discord.js';
import User from '../repository/User';
import discordService from '../services/discordService';
import loggerService from '../services/loggerService';

export default async (message: Message): Promise<void> => {
    loggerService.title('Rollback');
    discordService.isAdmin(message);
    const users = await User.findMany({
        guildID: message.guild.id,
    });
    for (const user of users) {
        const member = await discordService.fetchMember(message.guild, user.discordID);
        if (user.nickname === member.nickname) {
            // unset nickname here
        } else {
            // reset nickname here
        }
    }
    // invoke guild delete
    // send last message
    // leave guild
};
