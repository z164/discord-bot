export default interface IProfileData {
    account_id: number;
    slots: [any];
    badge_points: number;
    event_points: number;
    event_id: number;
    recent_battle_cup_victory: any;
    rank_tier: Rank;
    leaderboard_rank: number;
    is_plus_subscriber: boolean;
    plus_original_start_date: number;
    rank_tier_score: number;
    previous_rank_tier: number;
    leaderboard_rank_core: number;
    rank_tier_peak: Rank;
    title: any;
    favourite_team_packed: any;
}

// prettier-ignore
type Rank = 0 |
11 | 12 | 13 | 14 | 15 | 16 | 17 |
21 | 22 | 23 | 24 | 25 | 26 | 27 |
31 | 32 | 33 | 34 | 35 | 36 | 37 |
41 | 42 | 43 | 44 | 45 | 46 | 47 |
51 | 52 | 53 | 54 | 55 | 56 | 57 |
61 | 62 | 63 | 64 | 65 | 66 | 67 |
71 | 72 | 73 | 74 | 75 | 76 | 77 |
80;
