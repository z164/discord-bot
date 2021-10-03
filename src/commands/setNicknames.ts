import {Client, Message} from 'discord.js';

import discordService from '../services/discordService';

import User from '../repository/User';
import Guild from '../repository/Guild';

import {parse, THEMES} from './util/logUtilities';
import loggerService from '../services/loggerService';
import DBotError from '../entities/errors/DBotError';
// import fetch64ID from './util/fetch64ID';

export default async function setNicknames(
    client: Client,
    guildID: string,
    message: Message = null
): Promise<void> {
    loggerService.title('Update');
    if (message !== null) {
        discordService.isAdmin(message);
    }
    const guildObj = await Guild.findOne({
        guildID: guildID,
    });
    if (guildObj === null) {
        throw new DBotError({
            messageToLog: `Guild ${guildID} tried to invoke update without being present in database`,
            messageToSend:
                "None of this guild's members are registered in system. Please register before using this command",
            discordMessage: message,
            layer: 'setNicknames',
            type: 'error',
        });
    }
    const currentGuild = await discordService.fetchGuild(client, guildID);
    // If update was invoked by schedule we log current guild and id.
    // If update was invoked by command location is logged in Recieve block
    if (message === null) {
        console.log(`${parse('Guild', THEMES.PROPERTY)}: ${guildObj.name}`);
        console.log(`${parse('ID', THEMES.PROPERTY)}: ${guildObj.guildID}`);
    } else {
        await discordService.reactWithEmoji(message, '👌');
    }
    const users = await User.findMany({
        guildID: guildObj._id,
    });
    for (const user of users) {
        const fetchedMember = await discordService.fetchMember(currentGuild, user.discordID);
        await discordService.updateNickname(fetchedMember, user);
    }
}
