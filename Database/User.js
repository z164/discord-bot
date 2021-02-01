'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild'
    },
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
});

module.exports = mongoose.model('User', userSchema);
