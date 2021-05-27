import UserModel from '../../entities/User';
import GuildModel from '../../entities/Guild';

import { parse, separator, title, themes } from './logUtilities';

export default async (guildID: string) => {
    title('GuildDelete');
    const guild = await GuildModel.findOneAndDelete({
        guildID: guildID,
    });
    if (guild !== null) {
        const res = await UserModel.deleteMany({
            guildID: guild._id,
        });
        console.log(parse(`${res.deletedCount} users cleared from ${guild.name}:${guild.guildID}`, themes.log));
        console.log(separator);
    }
};

