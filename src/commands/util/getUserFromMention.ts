import {Message} from 'discord.js';

import Guild from '../../repository/Guild';
import User from '../../repository/User';

import {IUser} from '../../entities/User';

import {parse, separator, themes} from './logUtilities';

export default async function getUserFromMention(message: Message): Promise<IUser> {
    if (!message.mentions.users.first()) {
        console.log(parse('No user was mentioned', themes.error));
        console.log(separator);
        message.channel.send('No user mentioned');
        throw new Error('No user was mentioned');
    }
    let idToGet = message.mentions.users.first().id;
    if (idToGet === message.guild.ownerID) {
        console.log(parse("Mentioned user is a guild owner. Using bot's id to proceed", themes.warning));
        idToGet = message.guild.me.id;
    }
    const guild = await Guild.findOne({
        guildID: message.guild.id,
    });
    if (guild === null) {
        console.log(parse('User invoked this command from non-existing in DB guild', themes.error));
        console.log(separator);
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
        console.log(parse('Mentioned user is not registered in system', themes.error));
        console.log(separator);
        message.channel.send('This user is not registered in system');
        throw new Error('This user is not registered in system');
    }
    return user;
}
