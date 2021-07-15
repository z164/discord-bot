import guildDelete from '../../../commands/util/guildDelete';
import Guild from '../../../repository/Guild';
import User from '../../../repository/User';

export default () => {
    it('Should delete guild from database', async () => {
        expect(
            await Guild.findOne({
                guildID: '861618895818850305',
            })
        ).toBeTruthy();
        await guildDelete('861618895818850305');
        expect(
            await Guild.findOne({
                guildID: '861618895818850305',
            })
        ).toBeFalsy();
    });
    it('Should cleanup guild\'s users if guild was deleted', async () => {
        expect(
            await User.findMany({
                guildID: '60f005d6a24baa54084c1ff6'
            })
        ).toHaveLength(0)
    })
};
