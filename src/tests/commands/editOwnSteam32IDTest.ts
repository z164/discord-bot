import editOwnSteam32ID from '../../commands/editOwnSteam32ID';

import * as getAuthorAsUser from '../../commands/util/getAuthorAsUser';
import {IUser} from '../../entities/User';
import User from '../../repository/User';

import messageFactory from '../mocks/mockMessageFactory';

const _: undefined = undefined;

export default () => {
    it('Should return message if Steam 32ID is not provided', async () => {
        jest.spyOn(getAuthorAsUser, 'default').mockImplementation(async () => {
            return {
                _id: '601339f597a6a523bce68c7a',
                __v: 0,
                canEdit: true,
                discordID: '786141154021867521',
                dotaNickname: 'z164',
                guildID: '601332eb9079da391c028da5',
                nickname: 'eora',
                steam32ID: 123562416,
                steam64ID: 10000000000001,
            } as unknown as IUser;
        });
        const message = messageFactory(_);
        await editOwnSteam32ID(message, ['']);
        expect(message.channel.send).toBeCalledWith('No Steam 32ID provided');
    });
    it('Should return message if user is banned from editing his Steam 32ID', async () => {
        jest.spyOn(getAuthorAsUser, 'default').mockImplementation(async () => {
            return {
                _id: '601339f597a6a523bce68c7a',
                __v: 0,
                canEdit: false,
                discordID: '786141154021867521',
                dotaNickname: 'z164',
                guildID: '601332eb9079da391c028da5',
                nickname: 'eora',
                steam32ID: 123562416,
                steam64ID: 10000000000001,
            } as unknown as IUser;
        });
        const message = messageFactory(_);
        await editOwnSteam32ID(message, ['123562416']);
        expect(message.channel.send).toBeCalledWith('You were banned from editing your Steam ID');
    });
    it('Should return message if everything was provided correctly', async () => {
        jest.spyOn(getAuthorAsUser, 'default').mockImplementation(async () => {
            return {
                _id: '601339f597a6a523bce68c7a',
                __v: 0,
                canEdit: true,
                discordID: '786141154021867521',
                dotaNickname: 'z164',
                guildID: '601332eb9079da391c028da5',
                nickname: 'eora',
                steam32ID: 123562416,
                steam64ID: 10000000000001,
            } as unknown as IUser;
        });
        const message = messageFactory(_);
        const beforeUpdate = await User.findOne({
            _id: '601339f597a6a523bce68c7a',
        });
        expect(beforeUpdate.steam32ID).toBe(123562416);
        await editOwnSteam32ID(message, ['123562417']);
        const afterUpdate = await User.findOne({
            _id: '601339f597a6a523bce68c7a',
        });
        expect(afterUpdate.steam32ID).toBe(123562417);
        expect(message.channel.send).toBeCalledWith('Your Steam ID was updated successfully');
    });
};
