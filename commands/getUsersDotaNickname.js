const User = require('../Database/User')
const Guild = require('../Database/Guild')

const getUsersDotaNickname = async (message) => {
    if(!message.mentions.users.first()) {
        message.channel.send('No user mentioned')
        return
    }
    const idToGet = message.mentions.users.first().id
    const guildObj = await Guild.findOne({
        guildID: message.guild.id
    })
    console.log(guildObj)
    const user = await User.findOne({
        guildID: guildObj._id,
        discordID: idToGet
    })
    if (user === null) {
        message.channel.send(`This user is not registered in system`)
        return
    }
    message.channel.send(`${user.nickname}'s Dota 2 nickname is ${user.dotaNickname}`)
}

module.exports = getUsersDotaNickname