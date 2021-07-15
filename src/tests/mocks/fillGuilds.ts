import {readFileSync} from 'fs';

import {GuildObj} from '../../entities/Guild';
import Guild from '../../repository/Guild';

export default async function () {
    const guildsString = readFileSync('./src/tests/mocks/data/Guilds.json').toString();
    const guildsObj: GuildObj[] = JSON.parse(guildsString);
    for (const guild of guildsObj) {
        await Guild.create(guild);
    }
    console.log(await Guild.findMany());
}
