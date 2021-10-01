import {Message} from 'discord.js';

import Guild from '../../repository/Guild';
import User from '../../repository/User';

import {IUser} from '../../entities/User';

import {parse, THEMES} from './logUtilities';
import loggerService from '../../services/loggerService';

export default async function getAuthorAsUser(message: Message): Promise<IUser> {
    let discordID = message.member.user.id;
    const nickname = message.member.nickname ?? message.member.user.username;
    if (message.author.id === message.guild.ownerID) {
        loggerService.warning(`${parse(nickname, THEMES.NICKNAME_STYLE)} is a guild owner. Using bot's id to proceed`);
        discordID = message.guild.me.id;
    }
    const guild = await Guild.findOne({
        guildID: message.guild.id,
    });
    if (guild === null) {
        loggerService.error('User invoked this command from non-existing in DB guild');
        loggerService.separator();
        message.channel.send(
            "None of this guild's members are registered in system. Please register before using this command"
        );
        throw new Error('User invoked this command from non-existing in DB guild');
    }
    const user = await User.findOne({
        discordID: discordID,
        guildID: guild._id,
    });
    if (user === null) {
        loggerService.error('User that invoked this command is not registered');
        loggerService.separator();
        message.channel.send('You are not registered');
        throw new Error('User that invoked this command is not registered');
    }
    return user;
}
