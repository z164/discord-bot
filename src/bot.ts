import * as discord from 'discord.js';
import mongoose from 'mongoose';

import { parse, themes, title, separator } from './commands/utility/logUtilities';

import register from './commands/register';
import setNicknames from './commands/setNicknames';
import editOwnDotaNickname from './commands/editOwnDotaNickname';
import canEditPermissionsSet from './commands/canEditPermissionsSet';
import setUsersDotaNickname from './commands/setUsersDotaNickname';
import getUsersDotaNickname from './commands/getUsersDotaNickname';
import help from './commands/help';

import interval from './commands/utility/interval';
import guildDelete from './commands/utility/guildDelete';
import updateNickname from './commands/utility/updateNickname';

require('dotenv').config();

const client = new discord.Client();
client.login(process.env.BOT_TOKEN).then(() => {
    console.log('Bot logged in');
});

mongoose.connect(
    process.env.URI || '',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => {
        console.log('MongoDB cluster connection established');
    }
);

const messageHandle = async (message: discord.Message) => {
    if (message.author.bot) {
        return;
    }
    const [prefix, command, ...body] = message.content.split(' ');
    if (prefix !== process.env.prefix) {
        return;
    }
    title('Recieve');
    console.log(`${parse('Command', themes.property)}: ${command}`);
    console.log(
        body.join(' ').trim() === ''
            ? parse('No body provided', themes.warning)
            : `${parse('Body', themes.property)}: ${body.join(' ').trim()}`
    );
    console.log(`${parse('Location', themes.property)}: ${message.guild.name}`);
    console.log(`${parse('ID', themes.property)}: ${message.guild.id}`);
    console.log(`${parse('Author', themes.property)}: ${message.member.nickname}`);
    console.log(`${parse('ID', themes.property)}: ${message.author.id}`);
    console.log(separator);
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
client.on('guildDelete', async (guild) => {
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
    if (newNicknameCut !== oldNicknameCut && newMember.user.id !== client.user.id) {
        console.log(parse('Nickname was updated due to change', themes.log));
        console.log(separator);
        updateNickname(newNicknameCut, id);
    }
});
