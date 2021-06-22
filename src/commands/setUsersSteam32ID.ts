import UserModel from '../entities/User';
import GuildModel from '../entities/Guild';

import {Message} from 'discord.js';

import {parse, title, themes, separator} from './util/logUtilities';

import validateSteam32ID from './util/validateSteam32ID';
import fetch64ID from './util/fetch64ID';

export default async (message: Message, body: string[]) => {
    title('Set');
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        console.log(parse('Set was invoked by non-administrator user', themes.error));
        console.log(separator);
        message.channel.send('You need administrator permissions on server to do this');
        return;
    }
    if (!message.mentions.users.first()) {
        console.log(parse('No user was mentioned', themes.error));
        console.log(separator);
        message.channel.send('No user mentioned');
        return;
    }
    body.shift();
    const bodyStr = body.join(' ').trim();
    const steam32ID = validateSteam32ID(bodyStr);
    if (!steam32ID) {
        console.log(parse('Bad ID provided', themes.error));
        console.log(separator);
        message.channel.send('Please provide valid Steam32 ID');
        return;
    }
    let idToSet = message.mentions.users.first().id;
    if (idToSet === message.guild.ownerID) {
        console.log(parse("Mentioned user is a guild owner. Using bot's id to proceed", themes.warning));
        idToSet = message.guild.me.id;
    }
    const guildObj = await GuildModel.findOne({
        guildID: message.guild.id,
    });
    try {
        const res = await UserModel.findOneAndUpdate(
            {guildID: guildObj._id, discordID: idToSet},
            {steam32ID: steam32ID, steam64ID: await fetch64ID(steam32ID)}
        );
        if (res === null) {
            console.log(parse('Mentioned user is not registered in system', themes.error));
            console.log(separator);
            message.channel.send('This user is not registered in system');
        } else {
            console.log(
                parse(
                    `Changed ${parse(res.nickname, themes.nicknameStyle)}'s Steam32 ID to ${parse(
                        bodyStr,
                        themes.nicknameStyle
                    )}`,
                    themes.log
                )
            );
            console.log(separator);
            message.channel.send(`Changed ${res.nickname}'s Steam32 ID to ${bodyStr}`);
        }
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
};
