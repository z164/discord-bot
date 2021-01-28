const User = require('../Database/User')

const register = async (message, body) => {
    let discordID = message.member.user.id
    const nickname = message.member.nickname ?? message.member.user.username
    const dotaNickname = body.join(' ').trim()
    if(message.author.id === message.guild.ownerID) {
        discordID = message.guild.me.id
    }
    if (dotaNickname === '') {
        message.channel.send('No nickname provided')
        return
    }
    const user = await User.findOne({
        discordID: discordID
    })
    if (user) {
        message.channel.send('You are already registered')
        return
    }
    User.create({
        discordID: discordID,
        nickname: nickname,
        dotaNickname: dotaNickname,
        canEdit: true
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            message.channel.send(`Registered succesfully:\nID: ${message.member.user.id}\nNickname: ${nickname}\nDota Nickname: ${dotaNickname}`)
        }
    })
}

module.exports = register