import {Message} from 'discord.js';

import dota from '../dota';
import IProfileData from '../interfaces/profileData';
import loggerService from '../services/loggerService';

import parseRank from './util/parseRank';

import validateSteam32ID from './util/validateSteam32ID';

export default async function getRank(message: Message, body: Array<string>): Promise<void> {
    loggerService.title('getRank');
    const steam32ID = validateSteam32ID(body.join(' '));
    if (!steam32ID) {
        loggerService.error('Invalid body provided');
        loggerService.separator();
        message.channel.send('Invalid body provided');
        return;
    }
    const profileData: IProfileData = await dota.getProfile(steam32ID);
    if (profileData.rank_tier === null) {
        loggerService.error('Bad profile provided');
        loggerService.separator();
        message.channel.send('Bad profile');
        return;
    }
    const rank = parseRank(profileData);
    loggerService.log(`${rank} for ${profileData.account_id} fetched`);
    loggerService.separator();
    message.channel.send(rank);
}
