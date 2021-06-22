import {Message} from 'discord.js';
import UserModel from '../entities/User';
import fetch64ID from './util/fetch64ID';

import {parse, title, themes, separator} from './util/logUtilities';
import validateSteam32ID from './util/validateSteam32ID';

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
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        console.log(parse('Bad ID provided', themes.error));
        console.log(separator);
        message.channel.send('Please provide valid Steam32 ID');
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
        console.log(parse('User that invoked this command is banned from editing his Steam ID', themes.error));
        console.log(separator);
        message.channel.send('You were banned from editing your Steam ID');
        return;
    }
    try {
        await UserModel.findOneAndUpdate(
            {discordID: discordID},
            {steam32ID: steam32ID, steam64ID: await fetch64ID(steam32ID)}
        );
        console.log(parse('Steam ID successfully updated', themes.log));
        console.log(separator);
        message.channel.send('Your Steam ID was updated successfully');
    } catch (err) {
        console.error(err);
    }
};
