import * as discord from 'discord.js';

export class Discord {
    private Client: discord.Client;

    constructor() {
        this.Client = new discord.Client();
    }

    async connect(token: string) {
        await this.Client.login(token);
        console.log('Discord connected');
        return this.Client;
    }

    getClient() {
        return this.Client;
    }
}

const instance = new Discord();

export default instance;

export const client = instance.getClient();
