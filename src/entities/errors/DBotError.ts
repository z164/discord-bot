import {Message} from 'discord.js';
import IDBotErrorProperties, {DBotErrorType} from '../../interfaces/errorProperties';

export default class DBotError extends Error {
    readonly messageToLog: string;
    readonly layer: string;
    readonly messageToSend?: string;
    readonly discordMessage?: Message;
    readonly type: DBotErrorType;
    readonly callback?: Function;

    constructor(properties: IDBotErrorProperties) {
        super();
        this.messageToLog = properties.messageToLog;
        this.layer = properties.layer;
        this.messageToSend = properties.messageToSend;
        this.discordMessage = properties.discordMessage;
        this.type = properties.type;
        this.callback = properties.callback;

        Object.setPrototypeOf(this, DBotError.prototype);
    }
}
