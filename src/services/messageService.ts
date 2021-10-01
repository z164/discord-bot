import {Message} from 'discord.js';

import * as dotenv from 'dotenv';
import DBotError from '../entities/errors/DBotError';
dotenv.config();

export default class MessageService {
    private readonly message: Message;

    constructor(message: Message) {
        this.message = message;
    }

    isAdmin(): true {
        if (
            !this.message.member.hasPermission('ADMINISTRATOR') &&
            this.message.author.id !== process.env.BOT_AUTHOR_ID
        ) {
            throw new DBotError({
                messageToLog: 'Lock / Unlock was invoked by non-administrator user',
                messageToSend: 'You need administrator permissions on server to do this',
                type: 'error',
            });
            // loggerService.separator();
        }
        return true;
    }
}
