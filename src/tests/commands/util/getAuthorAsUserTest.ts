import {Document} from 'mongoose';

import messageFactory from '../../mocks/mockMessageFactory';

import discordService from '../../../services/discordService';
import DBotError from '../../../entities/errors/DBotError';
import HandleDBotError from '../../../handlers/dBotErrorHandler';

const _: undefined = undefined;

export default () => {
    it('Should throw an error and return message if guild is not found', async () => {
        const message = messageFactory(_, true);
        await discordService.getAuthorAsUser(message).catch((e: DBotError) => {
            HandleDBotError(e);
            expect(e.messageToLog).toBe('User invoked this command from non-existing in DB guild');
            expect(message.channel.send).toBeCalledWith(
                "None of this guild's members are registered in system. Please register before using this command",
            );
        });
    });

    it('Should throw an error and return message if author is not registered', async () => {
        const message = messageFactory(_, true, _, '629255459454320640');
        await discordService.getAuthorAsUser(message).catch((e: DBotError) => {
            HandleDBotError(e);
            expect(e.messageToLog).toBe('User that invoked this command is not registered');
            expect(message.channel.send).toBeCalledWith('You are not registered');
        });
    });

    it('Should return user if author is registered', async () => {
        const message = messageFactory(_, _, '786141154021867521', '629255459454320640');
        const user = await discordService.getAuthorAsUser(message);
        expect(user).toBeTruthy();
        expect(user).toHaveProperty('_id');
        expect(user).toBeInstanceOf(Document);
    });
};
