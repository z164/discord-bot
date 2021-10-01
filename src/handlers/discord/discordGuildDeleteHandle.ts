import {Guild} from 'discord.js';
import guildDelete from '../../commands/util/guildDelete';

export default async function guildDeleteHandle(guild: Guild): Promise<void> {
    await guildDelete(guild.id);
}
