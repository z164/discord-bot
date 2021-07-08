import {Message} from 'discord.js';

import {readFileSync} from 'fs';
import {join} from 'path';

import dota from '../dota'
;
import IProfileData from '../interfaces/profileData';

import {parse, separator, themes, title} from './util/logUtilities';

export default async function getRank(message: Message, body: Array<string>) {
    title('getRank');
    const pathToRanks = join(process.cwd(), 'src', 'commands', 'util', 'ranks.json');
    const ranks = JSON.parse(readFileSync(pathToRanks, 'utf-8').toString());
    if (isNaN(Number(body))) {
        console.log(parse('Invalid body provided', themes.error));
        console.log(separator);
        message.channel.send('Invalid body provided');
        return;
    }
    const profileData: IProfileData = await dota.getProfile(Number(body));
    if (profileData.rank_tier === null) {
        console.log(parse('Bad profile provided', themes.error));
        console.log(separator);
        message.channel.send('Bad profile');
        return;
    }
    if (profileData.leaderboard_rank !== null) {
        console.log(parse(`${profileData.leaderboard_rank} fetched`, themes.log));
        console.log(separator);
        message.channel.send(profileData.leaderboard_rank);
        return;
    }
    console.log(parse(`${profileData.leaderboard_rank} fetched`, themes.log));
    console.log(separator);
    message.channel.send(ranks[profileData.rank_tier]);
}
