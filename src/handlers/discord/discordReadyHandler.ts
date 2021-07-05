import schedule from 'node-schedule';
import setNicknames from '../../commands/setNicknames';
import {client} from '../../discord';

import GuildModel from '../../entities/Guild';
import {IGuild} from '../../entities/Guild';

export default async function ReadyHandler() {
    schedule.scheduleJob(
        {
            minute: 30,
        },
        async () => {
            const guilds: IGuild[] = await GuildModel.find({});
            for (const guild of guilds) {
                await setNicknames(client, guild.guildID);
            }
        }
    );
}
