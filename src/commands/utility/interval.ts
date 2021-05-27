import { Client } from 'discord.js';
import { IGuild } from '../../entities/Guild';
import setNicknames from '../setNicknames';

import Guild from '../../entities/Guild';

export default async (client: Client) => {
    const guilds: IGuild[] = await Guild.find({});
    guilds.forEach((guild: IGuild) => {
        setNicknames(client, guild.guildID);
    });
};
