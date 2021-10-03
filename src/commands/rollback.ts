import {Message} from 'discord.js';
import User from '../repository/User';
import loggerService from '../services/loggerService';

export default async (message: Message): Promise<void> => {
    loggerService.title('Rollback');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        loggerService.error('Lock / Unlock was invoked by non-administrator user');
        loggerService.separator();
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    const users = await User.findMany({
        guildID: message.guild.id,
    });
    for (const user of users) {
        // const member = await safeFetchMember(message.guild, user.discordID);
        // if (user.nickname === member.nickname) {
        // unset nickname here
        // } else {
        // reset nickname here
        // }
    }
    // invoke guild delete
    // send last message
    // leave guild
};
