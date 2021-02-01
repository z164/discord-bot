'use strict';

const User = require('../Database/User');

const logUtilities = require('./utility/logUtilities');

const editOwnDotaNickname = async (body, message) => {
    logUtilities.title('Edit');
    const bodyStr = body.join(' ').trim();
    const nickname = message.member.nickname ?? message.member.user.username;
    let discordID = message.member.user.id;
    if (message.author.id === message.guild.ownerID) {
        console.log(
            `${nickname.nicknameStyle} is a guild owner. Using bot's id to proceed`
                .warning
        );
        discordID = message.guild.me.id;
    }
    if (bodyStr === '') {
        console.log('No nickname provided'.error);
        console.log(logUtilities.separator);
        message.channel.send('No nickname provided');
        return;
    }
    const currentUser = await User.findOne({
        discordID: discordID
    });
    if (currentUser === null) {
        console.log(
            'User that invoked this command is not registered'.error
        );
        console.log(logUtilities.separator);
        message.channel.send('You are not registered');
        return;
    }
    if (!currentUser.canEdit) {
        console.log(
            'User that invoked this command is banned from editing his nickname'
                .error
        );
        console.log(logUtilities.separator);
        message.channel.send(
            'You were banned from editing your nickname'
        );
        return;
    }
    await User.findOneAndUpdate(
        {
            discordID: discordID
        },
        {
            dotaNickname: bodyStr
        },
        err => {
            if (err) {
                console.error(err);
            } else {
                console.log('Nickname successfully updated'.log);
                console.log(logUtilities.separator);
                message.channel.send(
                    'Your nickname was updated successfully'
                );
            }
        }
    );
};

module.exports = editOwnDotaNickname;
