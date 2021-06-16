import {Message} from 'discord.js';

import {client} from '../discord';

import register from '../commands/register';
import setNicknames from '../commands/setNicknames';
import editOwnDotaNickname from '../commands/editOwnDotaNickname';
import canEditPermissionsSet from '../commands/canEditPermissionsSet';
import setUsersDotaNickname from '../commands/setUsersDotaNickname';
import getUsersDotaNickname from '../commands/getUsersDotaNickname';
import help from '../commands/help';

import {parse, separator, themes, title} from '../commands/util/logUtilities';
import getRank from '../commands/getRank';

export default async function messageHandle(message: Message) {
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
        case 'getRank':
            getRank(message, body)
            break;
        default:
            message.channel.send('Unknown command');
            break;
    }
}
