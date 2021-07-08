import {Message} from 'discord.js';

import dota from '../dota';

import {IUser} from '../entities/User';

import {title} from './util/logUtilities';
import getUserFromMention from './util/getUserFromMention';
import getAuthorAsUser from './util/getAuthorAsUser';

export default async function create1v1Lobby(message: Message) {
    title('1v1 Lobby');
    message.channel.send('Will be available soon');
    return;
    let userInvited: IUser, currentUser: IUser;
    try {
        userInvited = await getUserFromMention(message);
        currentUser = await getAuthorAsUser(message);
    } catch {
        return;
    }
    await dota.createLobby();
    // await Promise.all([
    //     dota.inviteToLobby(String(userInvited.steam64ID)),
    //     dota.inviteToLobby(String(currentUser.steam64ID)),
    // ]);
    await dota.inviteToLobby(String(userInvited.steam64ID));
    await dota.inviteToLobby(String(currentUser.steam64ID));
    await dota.waitForPlayersSlot('123', '132');
    setTimeout(() => {
        dota.startLobby();
    }, 10000);
}
