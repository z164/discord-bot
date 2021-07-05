import {Message} from 'discord.js';
import {IUser} from '../../entities/User';

import GuildModel from '../../entities/Guild';
import UserModel from '../../entities/User';
import {parse, separator, themes} from './logUtilities';

export default async function getAuthorAsUser(message: Message): Promise<IUser> {
    let discordID = message.member.user.id;
    const nickname = message.member.nickname ?? message.member.user.username;
    if (message.author.id === message.guild.ownerID) {
        console.log(
            parse(
                `${parse(nickname, themes.nicknameStyle)} is a guild owner. Using bot's id to proceed`,
                themes.warning
            )
        );
        discordID = message.guild.me.id;
    }
    const guild = await GuildModel.findOne({
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
    const user = await UserModel.findOne({
        discordID: discordID,
        guildID: guild._id,
    });
    if (user === null) {
        console.log(parse('User that invoked this command is not registered', themes.error));
        console.log(separator);
        message.channel.send('You are not registered');
        throw new Error('User that invoked this command is not registered');
    }
    return user;
}
