import IProfileData from "./interfaces/profileData";
import profileData from "./interfaces/profileData";

const dota = require('dota2');

class Dota {
    private Client: any;

    async connect(steamClient: any) {
        this.Client = new dota.Dota2Client(steamClient, true);
        return new Promise((resolve, reject) => {
            this.Client.launch();
            this.Client.once('ready', () => {
                resolve('Dota client is ready');
            });
        });
    }

    async getProfile(id: number): Promise<IProfileData> {
        return new Promise((resolve, reject) => {
            this.Client.requestProfileCard(id);
            this.Client.once('profileCardData', function (accountId: any, profileData: profileData) {
                resolve(profileData);
            });
        });
    }
}

const instance = new Dota()

export default instance