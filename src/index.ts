import mongoose from 'mongoose';

import Discord from './discord';
import steam from './steam';
import dota from './dota';

import messageHandle from './handlers/discordMessageHandle';
import guildMemberUpdateHandle from './handlers/discordGuildMemberUpdateHandle';

import guildDelete from './commands/util/guildDelete';
import discordReadyHandler from './handlers/discordReadyHandler';

require('dotenv').config();

async function discordBootstrap() {
    const discordClient = await Discord.connect(process.env.BOT_TOKEN);
    discordClient.on('message', messageHandle);
    discordClient.on('guildMemberUpdate', guildMemberUpdateHandle);
    discordClient.on('ready', discordReadyHandler);
    discordClient.on('guildDelete', async (guild) => {
        await guildDelete(guild.id);
    });
}

async function mongooseBootstrap() {
    await mongoose.connect(process.env.URI || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }).catch(() => {
        console.log('MongoDB failed to connect')
        return
    });
    console.log('Connection to MongoDB established');
}

async function bootstrap() {
    await discordBootstrap();
    await mongooseBootstrap();
    await dota.connect(await steam.connect());
}

bootstrap();
