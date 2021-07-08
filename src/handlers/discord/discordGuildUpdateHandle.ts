import {Guild} from 'discord.js';

import GuildModel from '../../repository/Guild';

import {parse, themes, title} from '../../commands/util/logUtilities';

export default async function guildUpdateHandle(oldGuild: Guild, newGuild: Guild) {
    title('Guild update');
    if (oldGuild.name === newGuild.name) {
        console.log(parse('Guild update did not affect name of guild', themes.warning));
        return;
    }
    await GuildModel.updateOne({guildID: newGuild.id}, {name: newGuild.name});
    console.log(parse(`Guild ${oldGuild.name} updated it's name to ${newGuild.name}`, themes.log));
}
