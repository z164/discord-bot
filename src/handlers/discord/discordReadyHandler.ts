import schedule from 'node-schedule';
import Guild from '../../repository/Guild';

import {client} from '../../discord';
import setNicknames from '../../commands/setNicknames';
import {IGuild} from '../../entities/Guild';

export default async function ReadyHandler(): Promise<void> {
    schedule.scheduleJob(
        {
            minute: 30,
        },
        async () => {
            const guilds: IGuild[] = await Guild.findMany();
            for (const guild of guilds) {
                await setNicknames(client, guild.guildID);
            }
        }
    );
}
