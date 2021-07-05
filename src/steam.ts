import * as dotenv from 'dotenv';
import {title} from './commands/util/logUtilities';

dotenv.config();

const steam = require('steam');

class Steam {
    private readonly Client;

    private readonly User;

    private readonly Friends;

    constructor() {
        this.Client = new steam.SteamClient();
        this.User = new steam.SteamUser(this.Client);
        this.Friends = new steam.SteamFriends(this.Client);
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.Client.connect();
            this.Client.once('connected', () => {
                title('Steam connected');
                this.User.logOn({
                    account_name: process.env.steam_user,
                    password: process.env.steam_pass,
                });
            });
            this.Client.once('logOnResponse', (response: any) => {
                if (response.eresult !== steam.EResult.OK) {
                    console.log('Error logging in');
                    reject('Login failed');
                }
                title('Steam logged in');
                this.Friends.setPersonaState(steam.EPersonaState.Invisible);
                this.Friends.setPersonaName(process.env.steam_name);
                resolve(this.Client);
            });
        });
    }

    async disconnect() {
        await this.Client.disconnect();
        title('Steam disconnected');
    }
}

const instance = new Steam();

export default instance;
