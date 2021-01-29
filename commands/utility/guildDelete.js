const User = require('../../Database/User')
const Guild = require('../../Database/Guild')

const logUtilities = require('./logUtilities')

const guildDelete = async (guildID) => {
    logUtilities.title('GuildDelete')
    const guild = await Guild.findOneAndDelete({
        guildID: guildID
    })
    if(guild !== null) {
        const res = await User.deleteMany({
            guildID: guild._id
        })
        console.log(`${res.deletedCount} users cleared from ${guild.name}:${guild.guildID}`.log)
        console.log(logUtilities.separator)
    }
}

module.exports = guildDelete