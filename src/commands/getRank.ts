import {Message} from 'discord.js';

import dota from '../dota';
import IProfileData from '../interfaces/profileData';
import loggerService from '../services/loggerService';
import steam32IDService from '../services/steam32IDService';

import parseRank from './util/parseRank';

export default async function getRank(message: Message, body: string[]): Promise<void> {
    loggerService.title('getRank');
    const bodyString = body.join(' ').trim();
    steam32IDService.isSteam32IDExists(message, bodyString);
    const steam32ID = steam32IDService.validateSteam32ID(message, bodyString);
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
