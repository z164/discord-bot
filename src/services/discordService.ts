import dota from '../dota';
import {Client, Guild, GuildMember, Message, MessageReaction} from 'discord.js';
import * as dotenv from 'dotenv';

import loggerService from './loggerService';
import fetcherService, {FetcherService} from './fetcherService';

import DBotError from '../entities/errors/DBotError';
import User, {IUser} from '../entities/User';

import parseRank from '../commands/util/parseRank';
import {parse, THEMES} from '../commands/util/logUtilities';

dotenv.config();

class DiscordService {
    private readonly fetcherService: FetcherService;

    constructor() {
        this.fetcherService = fetcherService;
    }

    isAdmin(message: Message): void {
        if (!message.member.hasPermission('ADMINISTRATOR') && message.author.id !== process.env.BOT_AUTHOR_ID) {
            throw new DBotError({
                messageToLog: 'Lock / Unlock was invoked by non-administrator user',
                messageToSend: 'You need administrator permissions on server to do this',
                type: 'error',
                layer: this.constructor.name,
                discordMessage: message,
            });
        }
    }

    async getAuthorAsUser(message: Message) {
        return this.fetcherService.fetchAuthorAsUser(message);
    }

    async getUserFromMention(message: Message) {
        return this.fetcherService.fetchUserFromMention(message);
    }

    async fetchGuild(client: Client, guildID: string) {
        return this.fetcherService.fetchGuild(client, guildID);
    }

    async fetchMember(guild: Guild, memberID: string) {
        return this.fetcherService.fetchMemberFromGuild(guild, memberID);
    }

    async sendMessage(message: Message, messageToSend: string): Promise<Message> {
        return message.channel.send(messageToSend);
    }

    async reactWithEmoji(message: Message, emoji: string): Promise<MessageReaction> {
        return message.react(emoji);
    }

    async updateNickname(member: GuildMember, user: IUser) {
        if (!member) {
            loggerService.error(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is not present at current guild`);
            await User.deleteOne(user._id);
            loggerService.warning(`${parse(user.nickname, THEMES.NICKNAME_STYLE)} is removed from database`);
            return;
        }
        const profile = await dota.getProfile(user.steam32ID);
        const rank = parseRank(profile);
        try {
            await member.setNickname(`${user.nickname} [${rank}]`, 'Nickname changed due to rank update');
            loggerService.log(
                `${loggerService.styleString(user.nickname, THEMES.NICKNAME_STYLE)}'s rank was updated to ${parse(
                    String(rank),
                    THEMES.NICKNAME_STYLE
                )}`
            );
        } catch (error) {
            loggerService.error(`${user.nickname} is located higher than bot`);
        }
    }
}

export default new DiscordService();
