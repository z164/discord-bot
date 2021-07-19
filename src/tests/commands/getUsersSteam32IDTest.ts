import * as getUserFromMention from '../../commands/util/getUserFromMention';

import getUsersSteam32ID from '../../commands/getUsersSteam32ID';

import {IUser} from '../../entities/User';
import messageFactory from '../mocks/mockMessageFactory';

const _: undefined = undefined;

export default () => {
    it("Should return message with user's Steam 32ID", async () => {
        jest.spyOn(getUserFromMention, 'default').mockImplementation(async () => {
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
        await getUsersSteam32ID(message);
        expect(message.channel.send).toBeCalledWith("eora's Steam ID is 123562416");
    });
};
