'use strict';

const discord = require('discord.js');
const mongoose = require('mongoose');

const logUtilities = require('./commands/utility/logUtilities');

const register = require('./commands/register');
const setNicknames = require('./commands/setNicknames');
const editOwnDotaNickname = require('./commands/editOwnDotaNickname');
const canEditPermissionsSet = require('./commands/canEditPermissionsSet');
const setUsersDotaNickname = require('./commands/setUsersDotaNickname');
const getUsersDotaNickname = require('./commands/getUsersDotaNickname');
const help = require('./commands/help');

const interval = require('./commands/utility/interval');
const guildDelete = require('./commands/utility/guildDelete');
const updateNickname = require('./commands/utility/updateNickname');

require('dotenv').config();

const client = new discord.Client();
client.login(process.env.BOT_TOKEN).then(() => {
    console.log('Bot logged in');
});

mongoose.connect(
    process.env.URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    () => {
        console.log('MongoDB cluster connection established');
    }
);

const messageHandle = async message => {
    if (message.author.bot) {
        return;
    }
    const [prefix, command, ...body] = message.content.split(' ');
    if (prefix !== process.env.prefix) {
        return;
    }
    logUtilities.title('Recieve');
    console.log(`${'Command'.property}: ${command}`);
    console.log(
        body.join(' ').trim() === ''
            ? 'No body provided'.warning
            : `${'Body'.property}: ${body.join(' ').trim()}`
    );
    console.log(`${'Location'.property}: ${message.guild.name}`);
    console.log(`${'ID'.property}: ${message.guild.id}`);
    console.log(`${'Author'.property}: ${message.member.nickname}`);
    console.log(`${'ID'.property}: ${message.author.id}`);
    console.log(logUtilities.separator);
    switch (command) {
    case 'register':
        register(message, body);
        break;
    case 'update':
        setNicknames(client, message.guild.id, message);
        break;
    case 'edit':
        editOwnDotaNickname(body, message);
        break;
    case 'help':
        help(message.channel);
        break;
    case 'lock':
        canEditPermissionsSet(message, false);
        break;
    case 'unlock':
        canEditPermissionsSet(message, true);
        break;
    case 'get':
        getUsersDotaNickname(message);
        break;
    case 'set':
        setUsersDotaNickname(message, body);
        break;
    default:
        message.channel.send('Unknown command');
        break;
    }
};

client.on('message', messageHandle);

client.on('ready', async () => {
    setInterval(() => interval(client), 3600000);
});
client.on('guildDelete', async guild => {
    await guildDelete(guild.id);
});
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    let id = newMember.user.id;
    if (newMember.user.id === newMember.guild.ownerID) {
        id = client.user.id;
    }
    const newNickname = newMember.nickname ?? newMember.user.username;
    const oldNickname = oldMember.nickname ?? oldMember.user.username;
    const rankRegexp = /\s\[\d{1,4}\]/gm;
    const newNicknameCut = newNickname.replace(rankRegexp, '');
    const oldNicknameCut = oldNickname.replace(rankRegexp, '');
    if (
        newNicknameCut !== oldNicknameCut
        && newMember.user.id !== client.user.id
    ) {
        console.log('Nickname was updated due to change'.log);
        console.log(logUtilities.separator);
        updateNickname(newNicknameCut, id);
    }
});
