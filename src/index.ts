import discord from './discord';
import steam from './steam';
import dota from './dota';
import mongo from './mongo';

import {title} from './commands/util/logUtilities';

async function cleanup() {
    title('Cleanup');
    await mongo.disconnect();
    await discord.disconnect();
    await dota.disconnect();
    await steam.disconnect();
    process.exit(0)
}

async function bootstrap() {
    await mongo.bootstrap();
    await discord.bootstrap();
    await dota.connect(await steam.connect());
}

process.on('SIGINT', cleanup);

bootstrap();
