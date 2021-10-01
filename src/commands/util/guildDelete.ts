import User from '../../repository/User';
import Guild from '../../repository/Guild';

import loggerService from '../../services/loggerService';

export default async (guildID: string): Promise<void> => {
    loggerService.title('GuildDelete');
    const guild = await Guild.deleteOne({
        guildID: guildID,
    });
    if (guild !== null) {
        const res = await User.deleteMany({
            guildID: guild._id,
        });
        loggerService.log(`${res.deletedCount} users cleared from ${guild.name}:${guild.guildID}`);
        loggerService.separator();
    }
};
