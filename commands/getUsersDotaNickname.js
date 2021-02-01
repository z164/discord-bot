'use strict';

const User = require('../Database/User');
const Guild = require('../Database/Guild');

const logUtilities = require('./utility/logUtilities');

const getUsersDotaNickname = async message => {
    logUtilities.title('Get');
    if (!message.mentions.users.first()) {
        console.log('No user was mentioned'.error);
        console.log(logUtilities.separator);
        message.channel.send('No user mentioned');
        return;
    }
    let idToGet = message.mentions.users.first().id;
    if (idToGet === message.guild.ownerID) {
        console.log(
            "Mentioned user is a guild owner. Using bot's id to proceed"
                .warning
        );
        idToGet = message.guild.me.id;
    }
    const guildObj = await Guild.findOne({
        guildID: message.guild.id
    });
    console.log(guildObj);
    const user = await User.findOne({
        guildID: guildObj._id,
        discordID: idToGet
    });
    if (user === null) {
        console.log(
            'Mentioned user is not registered in system'.error
        );
        console.log(logUtilities.separator);
        message.channel.send('This user is not registered in system');
        return;
    }
    console.log(
        `${user.nickname.nicknameStyle}'s Dota 2 nickname is ${user.dotaNickname.nicknameStyle}`
            .log
    );
    message.channel.send(
        `${user.nickname}'s Dota 2 nickname is ${user.dotaNickname}`
    );
};

module.exports = getUsersDotaNickname;
