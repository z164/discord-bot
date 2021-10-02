import DBotError from '../entities/errors/DBotError';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';

export default async function HandleDBotError(error: DBotError) {
    if (error.type === 'error') {
        loggerService.error(`${error.layer}: ${error.messageToLog}`);
        loggerService.separator();
    }
    if (error.type === 'warn') {
        loggerService.warning(`${error.layer}: ${error.messageToLog}`);
    }
    if (error.callback) {
        await error.callback();
    }
    if (error.messageToSend && error.discordMessage) {
        await discordService.sendMessage(error.discordMessage, error.messageToSend);
    }
}
