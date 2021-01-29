"use strict";

const setNicknames = require("../setNicknames");

const Guild = require("../../Database/Guild");

const interval = async client => {
    const guilds = await Guild.find({});
    guilds.forEach(el => {
        setNicknames(client, el.guildID);
    });
};

module.exports = interval;
