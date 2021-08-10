import {Guild, GuildMember} from 'discord.js';

export default async function (guild: Guild, memberID: string): Promise<GuildMember | null> {
    try {
        return await guild.members.fetch(memberID);
    } catch {
        return null;
    }
}
