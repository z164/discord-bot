import discord from './discord';
import steam from './steam';
import dota from './dota';
import mongo from './mongo';

import loggerService from './services/loggerService';

async function cleanup() {
    loggerService.separator();
    loggerService.title('Cleanup');
    await mongo.disconnect();
    await discord.disconnect();
    await dota.disconnect();
    await steam.disconnect();
    loggerService.separator();
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
