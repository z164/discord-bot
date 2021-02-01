'use strict';

const User = require('../Database/User');
const Guild = require('../Database/Guild');

const colors = require('colors');
const moment = require('moment');

colors.setTheme({
    title: ['bold', 'underline'],
    nicknameStyle: ['bold', 'underline'],
    error: ['white', 'bgRed'],
    warning: ['bold', 'black', 'bgYellow'],
    log: ['bgGreen', 'white']
});
const separator = '----------------------------'.bold.red;

const setUsersDotaNickname = async (message, body) => {
    console.log(
        `[${moment(new Date()).format('H:mm:ss').magenta}][${
            'Set'.title
        }]`
    );
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(
            'Set was invoked by non-administrator user'.error
        );
        console.log(separator);
        message.channel.send(
            'You need administrator permissions on server to do this'
        );
        return;
    }
    if (!message.mentions.users.first()) {
        console.log('No user was mentioned'.error);
        console.log(separator);
        message.channel.send('No user mentioned');
        return;
    }
    body.shift();
    const bodyStr = body.join(' ').trim();
    let idToSet = message.mentions.users.first().id;
    if (idToSet === message.guild.ownerID) {
        console.log(
            "Mentioned user is a guild owner. Using bot's id to proceed"
                .warning
        );
        idToSet = message.guild.me.id;
    }
    const guildObj = await Guild.findOne({
        guildID: message.guild.id
    });
    await User.findOneAndUpdate(
        {
            guildID: guildObj._id,
            discordID: idToSet
        },
        {
            dotaNickname: bodyStr
        },
        (err, res) => {
            if (err) {
                console.log(err);
            } else if (res === null) {
                console.log(
                    'Mentioned user is not registered in system'.error
                );
                console.log(separator);
                message.channel.send(
                    'This user is not registered in system'
                );
            } else {
                console.log(
                    `Changed ${res.nickname.nicknameStyle}'s Dota 2 nickname to ${bodyStr.nicknameStyle}`
                        .log
                );
                console.log(separator);
                message.channel.send(
                    `Changed ${res.nickname}'s Dota 2 nickname to ${bodyStr}`
                );
            }
        }
    );
};

module.exports = setUsersDotaNickname;
