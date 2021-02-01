'use strict';

const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildID: {
        type: String
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model('Guild', guildSchema);
