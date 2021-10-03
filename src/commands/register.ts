import {Message} from 'discord.js';
import {NativeError} from 'mongoose';
import {IGuild} from '../entities/Guild';

import User from '../repository/User';
import Guild from '../repository/Guild';

import {parse, THEMES} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';
import fetch64ID from './util/fetch64ID';
import loggerService from '../services/loggerService';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Register');
    let discordID = message.member.user.id;
    let steam32ID: string | false | number = body.join(' ').trim();
    const nickname = message.member.nickname ?? message.member.user.username;
    const guildID = message.guild.id;
    const guildName = message.guild.name;
    if (steam32ID === '') {
        loggerService.error('No Steam32 ID provided');
        loggerService.separator();
        message.channel.send('No Steam32 ID provided');
        return;
    }
    steam32ID = validateSteam32ID(steam32ID);
    if (!steam32ID) {
        loggerService.error('Bad ID provided');
        loggerService.separator();
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    if (message.author.id === message.guild.ownerID) {
        loggerService.warning(
            `${parse(nickname, THEMES.NICKNAME_STYLE)} is a guild owner. Using bot's id to proceed`
        );
        discordID = message.guild.me.id;
    }
    let guild: IGuild;
    guild = await Guild.findOne({
        guildID: guildID,
    });
    if (!guild) {
        guild = await Guild.create({
            guildID: guildID,
            name: guildName,
        });
        loggerService.warning('Guild did not exist in database, so it was created');
    } else {
        loggerService.log('Guild exists in database');
    }
    const user = await User.findOne({
        guildID: guild._id,
        discordID: discordID,
    });
    if (user) {
        loggerService.error('User is already registered');
        loggerService.separator();
        message.channel.send('You are already registered');
        return;
    }
    await User.create({
        guildID: guild._id,
        discordID: discordID,
        nickname: nickname,
        steam32ID: steam32ID,
        steam64ID: await fetch64ID(steam32ID),
        canEdit: true,
    }).catch((err: NativeError) => {
        loggerService.error(`Error creating User: ${err.message}`);
    });
    loggerService.log(
        `${parse(nickname, THEMES.NICKNAME_STYLE)} registered successfully with id ${parse(
            String(steam32ID),
            THEMES.NICKNAME_STYLE
        )}`
    );
    loggerService.separator();
    message.channel.send(
        `Registered successfully:\nID: ${discordID}\nGuildID: ${guild.guildID}\nNickname: ${nickname}\nSteam32ID: ${steam32ID}`
    );
};
