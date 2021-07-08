import User from '../../repository/User';
import Guild from '../../repository/Guild';

import {parse, separator, title, themes} from './logUtilities';

export default async (guildID: string) => {
    title('GuildDelete');
    const guild = await Guild.deleteOne({
        guildID: guildID,
    });
    if (guild !== null) {
        const res = await User.deleteMany({
            guildID: guild._id,
        });
        console.log(parse(`${res.deletedCount} users cleared from ${guild.name}:${guild.guildID}`, themes.log));
        console.log(separator);
    }
};
