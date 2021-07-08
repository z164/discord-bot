import {Client, Message} from 'discord.js';

import dota from '../dota';

import User from '../repository/User'
import Guild from '../repository/Guild'

import {parse, title, themes, separator} from './util/logUtilities';
import parseRank from './util/parseRank';
// import fetch64ID from './util/fetch64ID';

export default async (client: Client, guildID: string, message: Message = null) => {
    title('Update');
    if (message !== null && !message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Update was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    const guildObj = await Guild.findOne({
        guildID: guildID,
    });
    if (guildObj === null) {
        console.log(parse(`Guild ${guildID} tried to invoke update without being present in database`, themes.error));
        console.log(separator);
        message.channel.send(
            "None of this guild's members are registered in system. Please register before using this command"
        );
        return;
    }
    const users = await User.findMany({
        guildID: guildObj._id,
    });
    let currentGuild;
    try {
        currentGuild = await client.guilds.fetch(guildID);
    } catch {
        console.log(
            parse(
                `Couldnt reach ${parse(guildID, themes.nicknameStyle)} guild, removing it from database`,
                themes.error
            )
        );
        await Guild.deleteOne({
            guildID: guildID,
        });
        console.log(separator);
        return;
    }
    for (const user of users) {
        const profile = await dota.getProfile(user.steam32ID);
        const rank = parseRank(profile);
        const fetchedMember = await currentGuild.members.fetch(user.discordID);
        fetchedMember
            .setNickname(`${user.nickname} [${rank}]`, 'Nickname changed due to rank update')
            .then(() => {
                console.log(
                    parse(
                        `${parse(user.nickname, themes.nicknameStyle)}'s rank was updated to ${parse(
                            String(rank),
                            themes.nicknameStyle
                        )}`,
                        themes.log
                    )
                );
            })
            .catch(() => {
                console.log(parse(`${user.nickname} is located higher than bot`, themes.error));
            });
        // If update was invoked by schedule we log current guild and id.
        // If update was invoked by command location is logged in Recieve block
        if (message === null) {
            console.log(`${parse('Guild', themes.property)}: ${guildObj.name}`);
            console.log(`${parse('ID', themes.property)}: ${guildObj.guildID}`);
        }
    }
};
