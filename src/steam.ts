import * as dotenv from 'dotenv';
import {parse, themes, title} from './commands/util/logUtilities';

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

    async bootstrap() {
        await this.connect();
        // this.Client.on('error', (err: Error) => {
        //     console.log(err)
        //     console.log(parse('Steam disconnected', themes.error))
        //     const intervalID = setInterval(async () => {
        //         await this.connect()
        //         .then(() => {
        //             console.log(parse('Steam is up, clearing interval', themes.log))
        //             clearInterval(intervalID)
        //         })
        //         .catch(() => {
        //             console.log(parse('Steam is still not up', themes.warning))
        //         })
        //     }, 3600)
        // })
        return this.Client;
    }
}

const instance = new Steam();

export default instance;
