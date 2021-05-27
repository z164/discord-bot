export interface IData {
    time_posted: number;
    next_scheduled_post_time: number;
    server_time: number;
    leaderboard: [
        {
            rank: number;
            name: string;
            team_id?: number;
            team_tag?: string;
            country?: string;
            sponsor?: string;
        }
    ];
}
