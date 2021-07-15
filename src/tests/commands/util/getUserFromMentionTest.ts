import {Document} from 'mongoose';

import messageFactory from '../../mocks/mockMessageFactory';

import getUserFromMention from '../../../commands/util/getUserFromMention';

const _: undefined = undefined;

export default () => {
    it('Should throw an error and return message if guild is not found', async () => {
        const message = messageFactory(_, true);
        await getUserFromMention(message).catch((err: Error) => {
            expect(err.message).toBe('User invoked this command from non-existing in DB guild');
            expect(message.channel.send).toBeCalledWith(
                "None of this guild's members are registered in system. Please register before using this command"
            );
        });
    });
    it('Should throw an error and return message if mentioned user is not registered', async () => {
        const message = messageFactory(_, true, _, '629255459454320640');
        await getUserFromMention(message).catch((err: Error) => {
            expect(err.message).toBe('This user is not registered in system');
            expect(message.channel.send).toBeCalledWith('This user is not registered in system');
        });
    });
    it('Should return user if everything passed is correct', async () => {
        const message = messageFactory(_, _, _, '629255459454320640', '786141154021867521');
        const user = await getUserFromMention(message);
        console.log(user);
        expect(user).toBeTruthy();
        expect(user).toHaveProperty('_id');
        expect(user).toBeInstanceOf(Document);
    });
};
