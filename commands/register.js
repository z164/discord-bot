'use strict';

const User = require('../Database/User');
const Guild = require('../Database/Guild');

const logUtilities = require('./utility/logUtilities');

const register = async (message, body) => {
    logUtilities.title('Register');
    let discordID = message.member.user.id;
    const nickname = message.member.nickname ?? message.member.user.username;
    const dotaNickname = body.join(' ').trim();
    const guildID = message.guild.id;
    const guildName = message.guild.name;
    if (message.author.id === message.guild.ownerID) {
        console.log(
            `${nickname.nicknameStyle} is a guild owner. Using bot's id to proceed`
                .warning
        );
        discordID = message.guild.me.id;
    }
    if (dotaNickname === '') {
        console.log('No nickname provided'.error);
        console.log(logUtilities.separator);
        message.channel.send('No nickname provided');
        return;
    }
    let guildObj;
    const guild = await Guild.findOne({
        guildID: guildID
    });
    guildObj = guild;
    if (!guild) {
        guildObj = await Guild.create({
            guildID: guildID,
            name: guildName
        });
        console.log(
            'Guild did not exist in database, so it was created'
                .warning
        );
    } else {
        console.log('Guild exists in database'.log);
    }
    const user = await User.findOne({
        guildID: guildObj._id,
        discordID: discordID
    });
    if (user) {
        console.log('User is already registered'.error);
        console.log(logUtilities.separator);
        message.channel.send('You are already registered');
        return;
    }
    User.create(
        {
            guildID: guildObj._id,
            discordID: discordID,
            nickname: nickname,
            dotaNickname: dotaNickname,
            canEdit: true
        },
        err => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    `${nickname.nicknameStyle} registered successfully with nickname ${dotaNickname.nicknameStyle}`
                        .log
                );
                console.log(logUtilities.separator);
                message.channel.send(
                    `Registered successfully:\nID: ${discordID}\nGuildID: ${guildObj.guildID}\nNickname: ${nickname}\nDota Nickname: ${dotaNickname}`
                );
            }
        }
    );
};

module.exports = register;
