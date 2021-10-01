import * as discord from 'discord.js';
import * as dotenv from 'dotenv';

import discordHandlers from './handlers/discordHandlers';
import loggerService from './services/loggerService';

dotenv.config();

export class Discord {
    private Client: discord.Client;
    private token: string;

    constructor(token: string) {
        this.Client = new discord.Client();
        this.token = token;
    }

    async connect(): Promise<void> {
        await this.Client.login(this.token);
    }

    getClient(): discord.Client {
        return this.Client;
    }

    async disconnect(): Promise<void> {
        this.Client.destroy();
        loggerService.title('Discord disconnected');
    }

    async bootstrap(): Promise<void> {
        await this.connect();
        this.Client.on('message', discordHandlers.messageHandle);
        this.Client.on('guildMemberUpdate', discordHandlers.guildMemberUpdateHandle);
        this.Client.on('guildDelete', discordHandlers.guildDeleteHandle);
        this.Client.on('guildUpdate', discordHandlers.guildUpdateHandle);
        this.Client.on('ready', discordHandlers.readyHandler);
        loggerService.title('Discord ready');
    }
}

const token = process.env.NODE_ENV === 'production' ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_DEV;
const instance = new Discord(token);

export default instance;

export const client = instance.getClient();
