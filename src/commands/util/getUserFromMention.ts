import {Message} from 'discord.js';

import GuildModel from '../../entities/Guild';
import UserModel, {IUser} from '../../entities/User';

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
    const guildObj = await GuildModel.findOne({
        guildID: message.guild.id,
    });
    const user = await UserModel.findOne({
        guildID: guildObj._id,
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
