import { Message } from 'discord.js';
import UserModel from '../entities/User';

import { title, themes, separator, parse } from './utility/logUtilities';

export default async (message: Message, parameter: boolean) => {
    title('Lock / Unlock');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Lock / Unlock was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    let idToBan = message.mentions.users.first().id;
    if (idToBan === message.guild.ownerID) {
        console.log(parse("Mentioned user is a guild owner. Using bot's id to proceed", themes.warning));
        idToBan = message.guild.me.id;
    }
    const usertoBan = await UserModel.findOne({
        discordID: idToBan,
    });
    if (usertoBan === null) {
        console.log(parse('User that was mentioned is not registered', themes.error));
        console.log(separator);
        message.channel.send('User is not registered in system');
        return;
    }
    try {
        const res = await UserModel.findOneAndUpdate({ discordID: idToBan }, { canEdit: parameter });
        console.log(
            parse(
                `${parse(res.dotaNickname, themes.nicknameStyle)} ${
                    parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'
                }`,
                themes.log
            )
        );
        message.channel.send(
            `${res.dotaNickname} ${parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'}`
        );
    } catch (err) {
        console.error(err);
    }
};
