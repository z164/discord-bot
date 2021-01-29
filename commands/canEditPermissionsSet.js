const User = require('../Database/User')

const logUtilities = require('./utility/logUtilities')

const canEditPermissionsSet = async (message, parameter) => {
    logUtilities.title('Lock / Unlock')
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log('Lock / Unlock was invoked by non-administrator user'.error)
        console.log(logUtilities.separator)
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    const idToBan = message.mentions.users.first().id
    const usertoBan = await User.findOne({
        discordID: idToBan
    })
    if(usertoBan === null) {
        console.log('User that was mentioned is not registered'.error)
        console.log(logUtilities.separator)
        message.channel.send('User is not registered in system')
        return
    }
    await User.findOneAndUpdate({
        discordID: idToBan
    }, {
        canEdit: parameter
    }, (err, res) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`${res.dotaNickname.nicknameStyle} ${parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'}`.log)
            message.channel.send(`${res.dotaNickname} ${parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'}`)
        }
    })
}

module.exports = canEditPermissionsSet