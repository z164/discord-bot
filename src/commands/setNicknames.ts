import {Client, Message} from 'discord.js';

import dota from '../dota';

import User from '../repository/User';
import Guild from '../repository/Guild';

import {parse, THEMES} from './util/logUtilities';
import parseRank from './util/parseRank';
import safeFetchMember from './util/safeFetchMember';
import loggerService from '../services/loggerService';
// import fetch64ID from './util/fetch64ID';

export default async (client: Client, guildID: string, message: Message = null): Promise<void> => {
    loggerService.title('Update');
    if (message !== null && !message.member.hasPermission('ADMINISTRATOR')) {
        loggerService.error('Update was invoked by non-administrator user');
        loggerService.separator();
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    const guildObj = await Guild.findOne({
        guildID: guildID,
    });
    if (guildObj === null) {
        loggerService.error(`Guild ${guildID} tried to invoke update without being present in database`);
        loggerService.separator();
        message.channel.send(
            "None of this guild's members are registered in system. Please register before using this command"
        );
        return;
    }
    // If update was invoked by schedule we log current guild and id.
    // If update was invoked by command location is logged in Recieve block
    if (message === null) {
        console.log(`${parse('Guild', THEMES.PROPERTY)}: ${guildObj.name}`);
        console.log(`${parse('ID', THEMES.PROPERTY)}: ${guildObj.guildID}`);
    } else {
        await message.react('👌');
    }
    const users = await User.findMany({
        guildID: guildObj._id,
    });
    let currentGuild;
    try {
        currentGuild = await client.guilds.fetch(guildID);
    } catch {
        loggerService.error(`Couldnt reach ${parse(guildID, THEMES.NICKNAME_STYLE)} guild, removing it from database`);
        await Guild.deleteOne({
            guildID: guildID,
        });
        loggerService.separator();
        return;
    }
    for (const user of users) {
        const profile = await dota.getProfile(user.steam32ID);
        const rank = parseRank(profile);
        const fetchedMember = await safeFetchMember(currentGuild, user.discordID);
        if (!fetchedMember) {
            console.log(
                parse(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is not present at current guild`, THEMES.ERROR)
            );
            await User.deleteOne(user._id);
            console.log(
                parse(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is removed from database`, THEMES.WARNING)
            );
            continue;
        }
        fetchedMember
            .setNickname(`${user.nickname} [${rank}]`, 'Nickname changed due to rank update')
            .then(() => {
                console.log(
                    parse(
                        `${parse(user.nickname, THEMES.NICKNAME_STYLE)}'s rank was updated to ${parse(
                            String(rank),
                            THEMES.NICKNAME_STYLE
                        )}`,
                        THEMES.LOG
                    )
                );
            })
            .catch(() => {
                loggerService.error(`${user.nickname} is located higher than bot`);
            });
    }
};
