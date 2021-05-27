import { Message } from 'discord.js';

import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import { title, separator, themes, parse } from './utility/logUtilities';

export default async (message: Message) => {
    title('Get');
    if (!message.mentions.users.first()) {
        console.log(parse('No user was mentioned', themes.error));
        console.log(separator);
        message.channel.send('No user mentioned');
        return;
    }
    let idToGet = message.mentions.users.first().id;
    if (idToGet === message.guild.ownerID) {
        console.log(parse("Mentioned user is a guild owner. Using bot's id to proceed", themes.warning));
        idToGet = message.guild.me.id;
    }
    const guildObj = await GuildModel.findOne({
        guildID: message.guild.id,
    });
    console.log(guildObj);
    const user = await UserModel.findOne({
        guildID: guildObj._id,
        discordID: idToGet,
    });
    if (user === null) {
        console.log(parse('Mentioned user is not registered in system', themes.error));
        console.log(separator);
        message.channel.send('This user is not registered in system');
        return;
    }
    console.log(
        parse(
            `${parse(user.nickname, themes.nicknameStyle)}'s Dota 2 nickname is ${parse(
                user.dotaNickname,
                themes.nicknameStyle
            )}`,
            themes.log
        )
    );
    message.channel.send(`${user.nickname}'s Dota 2 nickname is ${user.dotaNickname}`);
};
