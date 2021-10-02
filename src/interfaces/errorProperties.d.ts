import {Message} from 'discord.js';

export default interface IDBotErrorProperties {
    messageToLog: string;
    layer: string;
    messageToSend?: string;
    callback?: Function;
    discordMessage?: Message;
    type: DBotErrorType;
}

export type DBotErrorType = 'error' | 'warn';
