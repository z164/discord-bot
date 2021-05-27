import { Message } from 'discord.js';
import UserModel from '../entities/User';

import { parse, title, themes, separator } from './utility/logUtilities';

export default async (body: string[], message: Message) => {
    title('Edit');
    const bodyStr = body.join(' ').trim();
    const nickname = message.member.nickname ?? message.member.user.username;
    let discordID = message.member.user.id;
    if (message.author.id === message.guild.ownerID) {
        console.log(
            parse(
                `${parse(nickname, themes.nicknameStyle)} is a guild owner. Using bot's id to proceed`,
                themes.warning
            )
        );
        discordID = message.guild.me.id;
    }
    if (bodyStr === '') {
        console.log(parse('No nickname provided', themes.error));
        console.log(separator);
        message.channel.send('No nickname provided');
        return;
    }
    const currentUser = await UserModel.findOne({
        discordID: discordID,
    });
    if (currentUser === null) {
        console.log(parse('User that invoked this command is not registered', themes.error));
        console.log(separator);
        message.channel.send('You are not registered');
        return;
    }
    if (!currentUser.canEdit) {
        console.log(parse('User that invoked this command is banned from editing his nickname', themes.error));
        console.log(separator);
        message.channel.send('You were banned from editing your nickname');
        return;
    }
    try {
        await UserModel.findOneAndUpdate({ discordID: discordID }, { dotaNickname: bodyStr });
        console.log(parse('Nickname successfully updated', themes.log));
        console.log(separator);
        message.channel.send('Your nickname was updated successfully');
    } catch (err) {
        console.error(err);
    }
};
