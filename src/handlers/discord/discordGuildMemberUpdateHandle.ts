import {client} from '../../discord';
import {GuildMember, PartialGuildMember} from 'discord.js';

import updateNickname from '../../commands/util/updateNickname';
import loggerService from '../../services/loggerService';

export default function guildMemberUpdateHandle(
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
): void {
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
        loggerService.title('Member update');
        loggerService.log('Nickname was updated due to change');
        loggerService.separator();
        updateNickname(newNicknameCut, userID, newMember.guild.id);
    }
}
