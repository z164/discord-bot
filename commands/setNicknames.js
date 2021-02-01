'use strict';

const axios = require('axios');

const User = require('../Database/User');
const Guild = require('../Database/Guild');

const logUtilities = require('./utility/logUtilities');

const setNicknames = async (client, guildID, message = null) => {
    logUtilities.title('Update');
    if (
        message !== null
        && !message.member.hasPermission('ADMINISTRATOR')
    ) {
        console.log(
            'Update was invoked by non-administrator user'.error
        );
        console.log(logUtilities.separator);
        message.channel.send(
            'You need administrator permissions on server to do this'
        );
        return;
    }
    axios
        .get(
            'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=europe&leaderboard=0'
        )
        .then(async response => {
            const { data } = response;
            const guildObj = await Guild.findOne({
                guildID: guildID
            });
            const users = await User.find({
                guildID: guildObj._id
            });
            let currentGuild;
            try {
                currentGuild = await client.guilds.fetch(guildID);
            } catch {
                await Guild.findOneAndDelete({
                    guildID: guildID
                });
                console.log(
                    `Couldnt reach ${guildID.nicknameStyle} guild, removing it from database`
                        .error
                );
                console.log(logUtilities.separator);
                return;
            }
            users.forEach(user => {
                const player = data.leaderboard.find(el => {
                    return (
                        el.name.toLowerCase()
                        === user.dotaNickname.toLowerCase()
                    );
                });
                currentGuild.members
                    .fetch(user.discordID)
                    .then(fetchedMember => {
                        try {
                            if (player) {
                                fetchedMember.setNickname(
                                    `${user.nickname} [${player.rank}]`,
                                    'Nickname changed due to rank update'
                                );
                                console.log(
                                    `${
                                        user.nickname.nicknameStyle
                                    }'s rank was updated to ${
                                        String(player.rank)
                                            .nicknameStyle
                                    }`.log
                                );
                                if (message === null) {
                                    console.log(
                                        `${'Guild'.property}: ${
                                            guildObj.name
                                        }`
                                    );
                                    console.log(
                                        `${'ID'.property}: ${
                                            guildObj.guildID
                                        }`
                                    );
                                }
                            } else {
                                console.log(
                                    `${user.nickname.nicknameStyle} is not present on leaderboards. Reseting his nickname`
                                        .warning
                                );
                                fetchedMember.setNickname(
                                    `${user.nickname}`,
                                    'This player is not present on leaderboards'
                                );
                            }
                        } catch (err) {
                            console.log(
                                "Somehow server owner's nickname was tried to change"
                                    .error
                            );
                        }
                    });
            });
        });
};

module.exports = setNicknames;
