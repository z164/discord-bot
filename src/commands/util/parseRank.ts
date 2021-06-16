import {join} from 'path';
import {readFileSync} from 'fs';
import IProfileData from '../../interfaces/profileData';

const pathToRanks = join(process.cwd(), 'src', 'commands', 'util', 'ranks.json');
const ranks = JSON.parse(readFileSync(pathToRanks, 'utf-8').toString());

export default function parseRank(profileData: IProfileData): string {
    if (profileData.leaderboard_rank !== null) {
        return profileData.leaderboard_rank.toString();
    }
    return ranks[profileData.rank_tier];
}
