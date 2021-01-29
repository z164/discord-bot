const User = require('../Database/User')
const Guild = require('../Database/Guild')


const register = async (client, message, body) => {
    let discordID = message.member.user.id
    const nickname = message.member.nickname ?? message.member.user.username
    const dotaNickname = body.join(' ').trim()
    const guildID = message.guild.id
    const guildName = message.guild.name
    if (message.author.id === message.guild.ownerID) {
        discordID = message.guild.me.id
    }
    if (dotaNickname === '') {
        message.channel.send('No nickname provided')
        return
    }
    let guildObj
    const guild = await Guild.findOne({
        guildID: guildID
    })
    guildObj = guild
    if (!guild) {
        guildObj = await Guild.create({
            guildID: guildID,
            name: guildName
        })
    }
    const user = await User.findOne({
        guildID: guildObj._id,
        discordID: discordID,
    })
    if (user) {
        message.channel.send('You are already registered')
        return
    }
    User.create({
        guildID: guildObj._id,
        discordID: discordID,
        nickname: nickname,
        dotaNickname: dotaNickname,
        canEdit: true
    }, (err) => {
        if (err) {
            console.log(err)
        } else {
            message.channel.send(`Registered successfully:\nID: ${discordID}\nGuildID: ${guildObj.guildID}\nNickname: ${nickname}\nDota Nickname: ${dotaNickname}`)
        }
    })
}

module.exports = register