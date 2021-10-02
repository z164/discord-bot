import {Client, Message} from 'discord.js';

import dota from '../dota';

import discordService from '../services/discordService';

import User from '../repository/User';
import Guild from '../repository/Guild';

import {parse, THEMES} from './util/logUtilities';
import parseRank from './util/parseRank';
import safeFetchMember from './util/safeFetchMember';
import loggerService from '../services/loggerService';
import DBotError from '../entities/errors/DBotError';
// import fetch64ID from './util/fetch64ID';

export default async function setNicknames(client: Client, guildID: string, message: Message = null): Promise<void> {
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
        const profile = await dota.getProfile(user.steam32ID);
        const rank = parseRank(profile);
        const fetchedMember = await safeFetchMember(currentGuild, user.discordID);
        if (!fetchedMember) {
            loggerService.error(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is not present at current guild`);
            await User.deleteOne(user._id);
            loggerService.warning(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is removed from database`);
            continue;
        }
        fetchedMember
            .setNickname(`${user.nickname} [${rank}]`, 'Nickname changed due to rank update')
            .then(() => {
                loggerService.log(
                    `${loggerService.styleString(user.nickname, THEMES.NICKNAME_STYLE)}'s rank was updated to ${parse(
                        String(rank),
                        THEMES.NICKNAME_STYLE
                    )}`
                );
            })
            .catch(() => {
                loggerService.error(`${user.nickname} is located higher than bot`);
            });
    }
}
