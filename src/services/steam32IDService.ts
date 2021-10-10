import {Message} from 'discord.js';
import DBotError from '../entities/errors/DBotError';

export class Steam32IDService {
    validateSteam32ID(message: Message, steam32ID: string): number {
        if (Number.isNaN(Number(steam32ID))) {
            throw new DBotError({
                messageToLog: 'Bad ID provided',
                messageToSend: 'Please provide valid Steam 32ID',
                discordMessage: message,
                layer: this.constructor.name,
                type: 'error',
            });
        }
        return Number(steam32ID);
    }

    isSteam32IDExists(message: Message, steam32ID: string): void {
        if (!steam32ID.length) {
            throw new DBotError({
                messageToLog: 'No Steam 32ID provided',
                messageToSend: 'No Steam 32ID provided',
                discordMessage: message,
                layer: this.constructor.name,
                type: 'error',
            });
        }
    }
}

export default new Steam32IDService();
