'use strict';

const User = require('../../Database/User');

const updateNickname = async (nickname, id) => {
    await User.findOneAndUpdate(
        {
            discordID: id
        },
        {
            nickname: nickname
        },
        err => {
            if (err) {
                console.error(err);
            }
        }
    );
};

module.exports = updateNickname;
