import messageFactory from '../mocks/mockMessageFactory';

import User from '../../repository/User';

import messageHandle from '../../handlers/discord/discordMessageHandle';

export default () => {
    it('Should reply correctly on unknown message', async () => {
        const message = messageFactory('z! undefined');
        await messageHandle(message);
        expect(message.channel.send).toBeCalledWith('Unknown command');
    });
    it('Should not react when prefix is not passed', async () => {
        const message = messageFactory('!z bad prefix');
        await messageHandle(message);
        expect(message.channel.send).not.toBeCalled();
    });
    it('Should return help message', async () => {
        const message = messageFactory('z! help');
        await messageHandle(message);
        expect(message.channel.send).toBeCalledTimes(2);
    });
    it('Should register user if id is correct', async () => {
        const message = messageFactory('z! register 111111111');
        await messageHandle(message);
        expect(
            await User.findOne({
                steam32ID: 111111111,
            }),
        ).toHaveProperty('_id');
    });
};
