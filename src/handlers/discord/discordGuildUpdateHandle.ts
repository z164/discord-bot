import {Guild} from 'discord.js';

import GuildModel from '../../repository/Guild';

import loggerService from '../../services/loggerService';

export default async function guildUpdateHandle(oldGuild: Guild, newGuild: Guild): Promise<void> {
    loggerService.title('Guild update');
    if (oldGuild.name === newGuild.name) {
        loggerService.warning('Guild update did not affect name of guild');
        return;
    }
    await GuildModel.updateOne({guildID: newGuild.id}, {name: newGuild.name});
    loggerService.log(`Guild ${oldGuild.name} updated it's name to ${newGuild.name}`);
}
