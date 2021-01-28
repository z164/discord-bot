const User = require('../Database/User')

const canEditPermissionsSet = async (message, parameter) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    const idToBan = message.mentions.users.first().id
    console.log(idToBan)
    await User.findOneAndUpdate({
        discordID: idToBan
    }, {
        canEdit: parameter
    }, (err, res) => {
        if (err) {
            console.error(err)
        } else {
            message.channel.send(`${res.dotaNickname} ${parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'}`)
        }
    })
}

module.exports = canEditPermissionsSet