import parseRank from '../../../commands/util/parseRank';
import IProfileData from '../../../interfaces/profileData';

export default () => {
    it('Should return correct leaderboard rank', () => {
        const profile = {
            leaderboard_rank: 120,
            rank_tier: 80,
        } as unknown as IProfileData;
        expect(parseRank(profile)).toBe('120');
    });
    it('Should return correct immortal rank', () => {
        const profile = {
            leaderboard_rank: null,
            rank_tier: 80,
        } as unknown as IProfileData;
        expect(parseRank(profile)).toBe('Immortal');
    });
    it('Should return correct non-immortal rank', () => {
        const profile = {
            leaderboard_rank: null,
            rank_tier: 72,
        } as unknown as IProfileData;
        expect(parseRank(profile)).toBe('Divine☆2');
    });
};
