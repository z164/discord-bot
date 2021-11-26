import {Document} from 'mongoose';

import messageFactory from '../../mocks/mockMessageFactory';

import discordService from '../../../services/discordService';
import DBotError from '../../../entities/errors/DBotError';
import HandleDBotError from '../../../handlers/dBotErrorHandler';

const _: undefined = undefined;

export default () => {
    it('Should throw an error and return message if guild is not found', async () => {
        const message = messageFactory(_, true);
        await discordService.getUserFromMention(message).catch((e: DBotError) => {
            HandleDBotError(e);
            expect(e.messageToLog).toBe('User invoked this command from non-existing in DB guild');
            expect(message.channel.send).toBeCalledWith(
                "None of this guild's members are registered in system. Please register before using this command",
            );
        });
    });
    it('Should throw an error and return message if mentioned user is not registered', async () => {
        const message = messageFactory(_, true, _, '629255459454320640');
        await discordService.getUserFromMention(message).catch((e: DBotError) => {
            HandleDBotError(e);
            expect(e.messageToLog).toBe('Mentioned user is not registered in system');
            expect(message.channel.send).toBeCalledWith('This user is not registered in system');
        });
    });
    it('Should return user if everything passed is correct', async () => {
        const message = messageFactory(_, _, _, '629255459454320640', '786141154021867521');
        const user = await discordService.getUserFromMention(message);
        expect(user).toBeTruthy();
        expect(user).toHaveProperty('_id');
        expect(user).toBeInstanceOf(Document);
    });
};
