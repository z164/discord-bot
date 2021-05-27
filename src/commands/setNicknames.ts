import axios from 'axios';
import { Client, Guild, Message } from 'discord.js';
import { IUser } from '../entities/User';

import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import { parse, title, themes, separator } from './utility/logUtilities';

export default async (client: Client, guildID: string, message: Message = null) => {
    title('Update');
    if (message !== null && !message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Update was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    axios
        .get('http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=europe&leaderboard=0')
        .then(async (response) => {
            const { data } = response;
            const guildObj = await GuildModel.findOne({
                guildID: guildID,
            });
            const users = await UserModel.find({
                guildID: guildObj._id,
            });
            let currentGuild: Guild;
            try {
                currentGuild = await client.guilds.fetch(guildID);
            } catch {
                await GuildModel.findOneAndDelete({
                    guildID: guildID,
                });
                console.log(
                    parse(
                        `Couldnt reach ${parse(guildID, themes.nicknameStyle)} guild, removing it from database`,
                        themes.error
                    )
                );
                console.log(separator);
                return;
            }
            users.forEach((user: IUser) => {
                const player = data.leaderboard?.find((el: any) => {
                    return el.name.toLowerCase() === user.dotaNickname.toLowerCase();
                });
                currentGuild.members.fetch(user.discordID).then((fetchedMember) => {
                    try {
                        if (player) {
                            fetchedMember.setNickname(
                                `${user.nickname} [${player.rank}]`,
                                'Nickname changed due to rank update'
                            );
                            console.log(
                                parse(
                                    `${parse(user.nickname, themes.nicknameStyle)}'s rank was updated to ${parse(
                                        String(player.rank),
                                        themes.nicknameStyle
                                    )}`,
                                    themes.log
                                )
                            );
                            if (message === null) {
                                console.log(`${parse('Guild', themes.property)}: ${guildObj.name}`);
                                console.log(`${parse('ID', themes.property)}: ${guildObj.guildID}`);
                            }
                        } else {
                            console.log(
                                parse(
                                    `${parse(
                                        user.nickname,
                                        themes.nicknameStyle
                                    )} is not present on leaderboards. Reseting his nickname`,
                                    themes.warning
                                )
                            );
                            fetchedMember.setNickname(`${user.nickname}`, 'This player is not present on leaderboards');
                        }
                    } catch (err) {
                        console.log(parse("Somehow server owner's nickname was tried to change", themes.error));
                    }
                });
            });
        });
};
