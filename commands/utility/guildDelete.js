const User = require('../../Database/User')
const Guild = require('../../Database/Guild')

const guildDelete = async (guildID) => {
    const guild = await Guild.findOneAndDelete({
        guildID: guildID
    })
    console.log(guild)
    if(guild !== null) {
        const res = await User.deleteMany({
            guildID: guild._id
        })
        console.log(`${res.deletedCount} users cleared from ${guild.name}:${guild.guildID}`)
    }
}

module.exports = guildDelete