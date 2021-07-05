import {client} from '../../discord';
import {GuildMember, PartialGuildMember} from 'discord.js';

import {parse, themes, separator, title} from '../../commands/util/logUtilities';
import updateNickname from '../../commands/util/updateNickname';

export default function guildMemberUpdateHandle(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
    let userID = newMember.user.id;
    if (newMember.user.id === newMember.guild.ownerID) {
        userID = client.user.id;
    }
    const newNickname = newMember.nickname ?? newMember.user.username;
    const oldNickname = oldMember.nickname ?? oldMember.user.username;
    const rankRegexp =
        /\s\[(\d{1,4}|Divine☆\d|Ancient☆\d|Legend☆\d|Archon☆\d|Crusader☆\d|Guardian☆\d|Herald☆\d|Uncalibrated|Immortal)\]/gm;
    const newNicknameCut = newNickname.replace(rankRegexp, '');
    const oldNicknameCut = oldNickname.replace(rankRegexp, '');
    if (newNicknameCut !== oldNicknameCut && newMember.user.id !== client.user.id) {
        title('Member update');
        console.log(parse('Nickname was updated due to change', themes.log));
        console.log(separator);
        updateNickname(newNicknameCut, userID, newMember.guild.id);
    }
}
