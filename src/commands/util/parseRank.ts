import ranks from './ranks';

import IProfileData from '../../interfaces/profileData';

export default function parseRank(
    profileData: IProfileData
    // | IProfileData[]
): string | {account_id: number; rank: number | string}[] {
    // Array logic

    // if (Array.isArray(profileData)) {
    //     const profiles: {
    //         account_id: number;
    //         rank: number | string;
    //     }[] = [];
    //     for (const profile of profileData) {
    //         let rank: number | string;
    //         if (profile.leaderboard_rank !== null) {
    //             rank = profile.leaderboard_rank;
    //         }
    //         rank = ranks[profile.rank_tier];
    //         profiles.push({
    //             account_id: profile.account_id,
    //             rank: rank,
    //         });
    //     }
    //     return profiles;
    // }

    // Non-array logic

    if (profileData.leaderboard_rank !== null) {
        return profileData.leaderboard_rank.toString();
    }
    return ranks[profileData.rank_tier];
}
