import {Message} from 'discord.js';
import {NativeError} from 'mongoose';
import {IGuild} from '../entities/Guild';

import User from '../repository/User';
import Guild from '../repository/Guild';

import {parse, THEMES} from './util/logUtilities';
import fetch64ID from './util/fetch64ID';
import loggerService from '../services/loggerService';
import discordService from '../services/discordService';
import DBotError from '../entities/errors/DBotError';

export default async (message: Message, body: string[]): Promise<void> => {
    loggerService.title('Register');
    let discordID = message.member.user.id;
    let bodyStr = body.join(' ').trim();
    const nickname = message.member.nickname ?? message.member.user.username;
    const guildID = message.guild.id;
    const guildName = message.guild.name;
    discordService.isSteam32IDExists(message, bodyStr);
    const steam32ID = discordService.validateSteam32ID(message, bodyStr);
    if (message.author.id === message.guild.ownerID) {
        loggerService.warning(
            `${parse(nickname, THEMES.NICKNAME_STYLE)} is a guild owner. Using bot's id to proceed`
        );
        discordID = message.guild.me.id;
    }
    let guild: IGuild;
    guild = await Guild.findOne({
        guildID,
    });
    if (!guild) {
        guild = await Guild.create({
            guildID,
            name: guildName,
        });
        loggerService.warning('Guild did not exist in database, so it was created');
    } else {
        loggerService.log('Guild exists in database');
    }
    const user = await User.findOne({
        guildID: guild._id,
        discordID,
    });
    if (user) {
        throw new DBotError({
            messageToLog: 'User is already registered',
            messageToSend: 'You are already registered',
            discordMessage: message,
            layer: 'Registration',
            type: 'error',
        });
    }
    await User.create({
        guildID: guild._id,
        discordID,
        nickname,
        steam32ID,
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
