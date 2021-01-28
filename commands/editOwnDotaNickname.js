const User = require('../Database/User')

const editOwnDotaNickname = async (body, message) => {
    const bodyStr = body.join(' ').trim()
    if (bodyStr === '') {
        message.channel.send('No nickname provided')
        return
    }
    const currentUser = await User.findOne({
        discordID: message.member.user.id
    })
    if (currentUser === null) {
        message.channel.send('You are not registered')
        return
    }
    if (!currentUser.canEdit) {
        message.channel.send('You were banned from editing your nickname')
        return
    }
    await User.findOneAndUpdate({
        discordID: message.member.user.id
    }, {
        dotaNickname: bodyStr
    }, (err, res) => {
        if (err) {
            console.error(err)
        } else {
            message.channel.send('Your nickname was updated succesfully')
        }
    })
}

module.exports = editOwnDotaNickname