const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordID: {
        type: String
    },
    nickname: {
        type: String
    },
    dotaNickname: {
        type: String
    },
    canEdit: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('User', userSchema)