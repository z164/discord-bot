import {DMChannel, Message} from 'discord.js';

import {client} from '../../discord';

import register from '../../commands/register';
import setNicknames from '../../commands/setNicknames';
import editOwnSteam32ID from '../../commands/editOwnSteam32ID';
import canEditPermissionsSet from '../../commands/canEditPermissionsSet';
import setUsersSteam32ID from '../../commands/setUsersSteam32ID';
import getUsersSteam32ID from '../../commands/getUsersSteam32ID';
import getRank from '../../commands/getRank';
import create1v1Lobby from '../../commands/create1v1Lobby';

import help from '../../commands/help';

import {parse, separator, themes, title} from '../../commands/util/logUtilities';

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
    if (message.channel instanceof DMChannel) {
        console.log(
            parse(
                `${message.channel.recipient.username}#${message.channel.recipient.discriminator} tried to DM bot`,
                themes.warning
            )
        );
        console.log(separator);
        message.channel.send('DMs are currently not supported');
        return;
    }
    console.log(`${parse('Location', themes.property)}: ${message.guild.name}`);
    console.log(`${parse('ID', themes.property)}: ${message.guild.id}`);
    console.log(`${parse('Author', themes.property)}: ${message.member.nickname}`);
    console.log(`${parse('ID', themes.property)}: ${message.author.id}`);
    console.log(separator);
    switch (command) {
        case 'register':
            await register(message, body);
            break;
        case 'update':
            await setNicknames(client, message.guild.id, message);
            break;
        case 'edit':
            await editOwnSteam32ID(message, body);
            break;
        case 'help':
            await help(message.channel);
            break;
        case 'lock':
            await canEditPermissionsSet(message, false);
            break;
        case 'unlock':
            await canEditPermissionsSet(message, true);
            break;
        case 'get':
            await getUsersSteam32ID(message);
            break;
        case 'set':
            await setUsersSteam32ID(message, body);
            break;
        case 'gr': // alias for getRank
        case 'getRank':
            await getRank(message, body);
            break;
        case 'zxc':
            await create1v1Lobby(message);
            break;
        default:
            message.channel.send('Unknown command');
            break;
    }
}
