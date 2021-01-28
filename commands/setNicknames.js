const axios = require('axios');

const User = require('../Database/User')

const setNicknames = async (message) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    axios.get('http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=europe&leaderboard=0')
        .then(async (response) => {
            const {
                data
            } = response
            const users = await User.find({})
            users.forEach(user => {
                const player = data.leaderboard.find(el => {
                    return el.name.toLowerCase() === user.dotaNickname.toLowerCase();
                });

                message.guild.members.fetch(user.discordID)
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