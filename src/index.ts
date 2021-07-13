import discord from './discord';
import steam from './steam';
import dota from './dota';
import mongo from './mongo';

import {separator, title} from './commands/util/logUtilities';

async function cleanup() {
    title('Cleanup');
    await mongo.disconnect();
    await discord.disconnect();
    await dota.disconnect();
    await steam.disconnect();
    console.log(separator);
    process.exit(0);
}

async function bootstrap() {
    await mongo.bootstrap();
    await discord.bootstrap();
    await dota.connect(await steam.bootstrap());
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

bootstrap();
