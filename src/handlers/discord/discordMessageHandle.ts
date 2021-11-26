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

import {parse, THEMES} from '../../commands/util/logUtilities';
import loggerService from '../../services/loggerService';
import HandleDBotError from '../dBotErrorHandler';
import DBotError from '../../entities/errors/DBotError';

export default async function messageHandle(message: Message): Promise<void> {
    if (message.author.bot) {
        return;
    }
    const [prefix, command, ...body] = message.content.split(' ');
    if (prefix !== process.env.prefix) {
        return;
    }
    loggerService.title('Recieve');
    console.log(`${parse('Command', THEMES.PROPERTY)}: ${command}`);
    console.log(
        body.join(' ').trim() === ''
            ? parse('No body provided', THEMES.WARNING)
            : `${parse('Body', THEMES.PROPERTY)}: ${body.join(' ').trim()}`,
    );
    if (message.channel instanceof DMChannel) {
        loggerService.warning(
            `${message.channel.recipient.username}#${message.channel.recipient.discriminator} tried to DM bot`,
        );
        loggerService.separator();
        message.channel.send('DMs are currently not supported');
        return;
    }
    console.log(`${parse('Location', THEMES.PROPERTY)}: ${message.guild.name}`);
    console.log(`${parse('ID', THEMES.PROPERTY)}: ${message.guild.id}`);
    console.log(`${parse('Author', THEMES.PROPERTY)}: ${message.member.nickname}`);
    console.log(`${parse('ID', THEMES.PROPERTY)}: ${message.author.id}`);
    loggerService.separator();
    try {
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
                await help(message);
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
    } catch (e) {
        if (e instanceof DBotError) {
            await HandleDBotError(e);
        }
    }
}
