import messageFactory from '../mocks/mockMessageFactory';

import discordService from '../../services/discordService';

import canEditPremissions from '../../commands/canEditPermissionsSet';

import {IUser} from '../../entities/User';
import DBotError from '../../entities/errors/DBotError';
import HandleDBotError from '../../handlers/dBotErrorHandler';

const _: undefined = undefined;

export default () => {
    it('Should return message if non-admin invoked setter', async () => {
        jest.spyOn(discordService, 'getUserFromMention').mockImplementation(async () => {
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
        const message = messageFactory(_, false);
        try {
            await canEditPremissions(message, false);
        } catch (e) {
            if (e instanceof DBotError) {
                HandleDBotError(e);
            }
            expect(message.member.hasPermission).toBeCalled();
            expect(message.channel.send).toBeCalledWith(
                'You need administrator permissions on server to do this',
            );
        }
    });

    it('Should return if user is not found', async () => {
        jest.spyOn(discordService, 'getUserFromMention').mockImplementation(async () => {
            throw new DBotError({
                messageToLog: 'Mentioned user is not registered in system',
                type: 'error',
                layer: 'test',
            });
        });
        const message = messageFactory(_, true, _, _, _);
        try {
            await canEditPremissions(message, false);
        } catch (e) {
            if (e instanceof DBotError) {
                HandleDBotError(e);
            }
            expect(message.channel.send).not.toBeCalledWith(
                expect.stringMatching(/\S* can no longer edit his Steam ID/),
            );
        }
    });

    it('Should return message if everything passed correctly', async () => {
        jest.spyOn(discordService, 'getUserFromMention').mockImplementation(async () => {
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
        const message = messageFactory(_, true, _, '629255459454320640', '786141154021867521');
        await canEditPremissions(message, false);
        expect(message.channel.send).toBeCalledWith(
            expect.stringMatching(/\S* can no longer edit his Steam ID/),
        );
    });
};
