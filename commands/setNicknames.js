const axios = require('axios');

const User = require('../Database/User')
const Guild = require('../Database/Guild')


const setNicknames = async (client, guildID, message = null) => {
    if (message !== null && !message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    axios.get('http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=europe&leaderboard=0')
        .then(async (response) => {
            const {
                data
            } = response
            const guildObj = await Guild.findOne({
                guildID: guildID
            })
            if (!guildObj) {
                console.log('No guild found')
                return
            }
            const users = await User.find({
                guildID: guildObj._id
            })
            let currentGuild
            try {
                currentGuild = await client.guilds.fetch(guildID)
            } catch {
                const intervals = require('./utility/intervals') // i have literally no idea, why doesnt it work outside of this block, but im done.
                await Guild.findOneAndDelete({
                    guildID: guildID
                })
                console.log(`Couldnt reach ${guildID} guild, removing it from database and clearing interval`)
                intervals.removeInterval(guildID)
                return
            }
            // console.log(currentGuild)
            users.forEach(user => {
                const player = data.leaderboard.find(el => {
                    return el.name.toLowerCase() === user.dotaNickname.toLowerCase();
                });
                currentGuild.members.fetch(user.discordID)
                    .then((response) => {
                        try {
                            if (player) {
                                response.setNickname(`${user.nickname} [${player.rank}]`, 'Nickname changed due to rank update');
                            } else {
                                response.setNickname(`${user.nickname}`, 'This player is not present on leaderboards')
                            }
                        } catch (err) {
                            console.log('I cant change server owner`s nickname :(')
                        }
                    })
            });
        })
}

module.exports = setNicknames