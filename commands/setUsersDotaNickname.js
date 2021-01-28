const User = require('../Database/User')

const setUsersDotaNickname = async (message, body) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    if(!message.mentions.users.first()) {
        message.channel.send('No user mentioned')
        return
    }
    body.shift()
    const bodyStr = body.join(' ').trim()
    const idToSet = message.mentions.users.first().id
    await User.findOneAndUpdate({
        discordID: idToSet
    }, {
        dotaNickname: bodyStr
    }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            if (res === null) {
                message.channel.send(`This user is not registered in system`)
            } else {
                message.channel.send(`Changed ${res.nickname}'s Dota 2 nickname to ${bodyStr}`)
            }
        }
    })
}

module.exports = setUsersDotaNickname