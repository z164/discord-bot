import {Message} from 'discord.js';

import dota from '../dota';
import IProfileData from '../interfaces/profileData';

import {parse, separator, themes, title} from './util/logUtilities';
import parseRank from './util/parseRank';

import validateSteam32ID from './util/validateSteam32ID';

export default async function getRank(message: Message, body: Array<string>) {
    title('getRank');
    const steam32ID = validateSteam32ID(body.join(' '));
    if (!steam32ID) {
        console.log(parse('Invalid body provided', themes.error));
        console.log(separator);
        message.channel.send('Invalid body provided');
        return;
    }
    const profileData: IProfileData = await dota.getProfile(steam32ID);
    if (profileData.rank_tier === null) {
        console.log(parse('Bad profile provided', themes.error));
        console.log(separator);
        message.channel.send('Bad profile');
        return;
    }
    const rank = parseRank(profileData);
    console.log(parse(`${rank} for ${profileData.account_id} fetched`, themes.log));
    console.log(separator);
    message.channel.send(rank);
}
