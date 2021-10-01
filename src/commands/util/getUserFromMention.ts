import {Message} from 'discord.js';

import Guild from '../../repository/Guild';
import User from '../../repository/User';

import {IUser} from '../../entities/User';

import loggerService from '../../services/loggerService';

export default async function getUserFromMention(message: Message): Promise<IUser> {
    if (!message.mentions.users.first()) {
        loggerService.error('No user was mentioned');
        loggerService.separator();
        message.channel.send('No user mentioned');
        throw new Error('No user was mentioned');
    }
    let idToGet = message.mentions.users.first().id;
    if (idToGet === message.guild.ownerID) {
        loggerService.warning("Mentioned user is a guild owner. Using bot's id to proceed");
        idToGet = message.guild.me.id;
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
        guildID: guild._id,
        discordID: idToGet,
    });
    if (user === null) {
        loggerService.error('Mentioned user is not registered in system');
        loggerService.separator();
        message.channel.send('This user is not registered in system');
        throw new Error('This user is not registered in system');
    }
    return user;
}
