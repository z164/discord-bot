import dota from '../../dota';

import getRank from '../../commands/getRank';

import messageFactory from '../mocks/mockMessageFactory';

import IProfileData from '../../interfaces/profileData';
import DBotError from '../../entities/errors/DBotError';
import HandleDBotError from '../../handlers/dBotErrorHandler';

const _: undefined = undefined;

export default () => {
    it('Should return message if Steam 32ID is invalid', async () => {
        const message = messageFactory(_);
        try {
            await getRank(message, ['']);
        } catch (e) {
            if (e instanceof DBotError) {
                HandleDBotError(e);
            }
            expect(message.channel.send).toBeCalledWith('No Steam 32ID provided');
        }
    });
    it('Should return message if profile is invalid', async () => {
        jest.spyOn(dota, 'getProfile').mockImplementation(async () => {
            return {
                rank_tier: null,
            } as unknown as IProfileData;
        });
        const message = messageFactory(_);
        await getRank(message, ['123123123']);
        expect(message.channel.send).toBeCalledWith('Bad profile');
    });
    it('Should return message if profile is correct for leaderboard rank', async () => {
        jest.spyOn(dota, 'getProfile').mockImplementation(async () => {
            return {
                rank_tier: 80,
                leaderboard_rank: 250,
            } as unknown as IProfileData;
        });
        const message = messageFactory(_);
        await getRank(message, ['123562416']);
        expect(message.channel.send).toBeCalledWith('250');
    });
    it('Should return message if profile is correct for non-leaderboard rank', async () => {
        jest.spyOn(dota, 'getProfile').mockImplementation(async () => {
            return {
                rank_tier: 64,
                leaderboard_rank: null,
            } as unknown as IProfileData;
        });
        const message = messageFactory(_);
        await getRank(message, ['123562416']);
        expect(message.channel.send).toBeCalledWith('Ancient☆4');
    });
};
