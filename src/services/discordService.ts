import {Client, DiscordAPIError, Guild, GuildMember, Message, MessageReaction} from 'discord.js';
import * as dotenv from 'dotenv';

import loggerService from './loggerService';
import fetcherService, {FetcherService} from './fetcherService';
import steam32IDService, {Steam32IDService} from './steam32IDService';

import DBotError from '../entities/errors/DBotError';

import User, {IUser} from '../entities/User';
import {parse, THEMES} from '../commands/util/logUtilities';

dotenv.config();

class DiscordService {
    private readonly fetcherService: FetcherService;
    private readonly steam32IDService: Steam32IDService;

    constructor() {
        this.fetcherService = fetcherService;
        this.steam32IDService = steam32IDService;
    }

    isAdmin(message: Message): void {
        if (
            !message.member.hasPermission('ADMINISTRATOR') &&
            message.author.id !== process.env.BOT_AUTHOR_ID
        ) {
            throw new DBotError({
                messageToLog: 'Command was invoked by non-administrator user',
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

    validateSteam32ID(message: Message, steam32ID: string) {
        return this.steam32IDService.validateSteam32ID(message, steam32ID);
    }

    isSteam32IDExists(message: Message, steam32ID: string) {
        return this.steam32IDService.isSteam32IDExists(message, steam32ID);
    }

    async sendMessage(message: Message, messageToSend: string): Promise<Message> {
        return message.channel.send(messageToSend);
    }

    async reactWithEmoji(message: Message, emoji: string): Promise<MessageReaction> {
        return message.react(emoji);
    }

    formatNickname(nickname: string, rank: string): string {
        const MAX_NICKNAME_LENGTH = 32;
        const DOTS_LENGTH = 3;
        const SPACE_LENGTH = 1;
        const rankInBracers = `[${rank}]`;
        const rankInBracersLength = rankInBracers.length;
        const nicknameLength = nickname.length;
        const finalLength = nicknameLength + SPACE_LENGTH + rankInBracersLength;
        if (finalLength > MAX_NICKNAME_LENGTH) {
            const allowedNicknameLength =
                MAX_NICKNAME_LENGTH - DOTS_LENGTH - SPACE_LENGTH - rankInBracersLength;
            const nicknameCut = nickname.slice(0, allowedNicknameLength) + '...';
            loggerService.warning(
                `${nickname}'s nickname was too big.\nIt have been cutted to ${nicknameCut}`
            );
            return `${nicknameCut} ${rankInBracers}`;
        }
        return `${nickname} ${rankInBracers}`;
    }

    async updateNickname(member: GuildMember, user: IUser) {
        if (!member) {
            loggerService.error(
                `${parse(user.nickname, THEMES.NICKNAME_STYLE)} is not present at current guild`
            );
            await User.deleteOne(user._id);
            loggerService.warning(
                `${parse(user.nickname, THEMES.NICKNAME_STYLE)} is removed from database`
            );
            return;
        }
        const rank = await this.fetcherService.fetchRank(user);
        try {
            const nicknameWithRank = this.formatNickname(user.nickname, rank);
            if (member.nickname === nicknameWithRank) {
                // skip here and log message that it was skipped
                // due not to spam into audit log
            }
            await member.setNickname(nicknameWithRank, 'Nickname changed due to rank update');
            loggerService.log(
                `${loggerService.styleString(
                    user.nickname,
                    THEMES.NICKNAME_STYLE
                )}'s rank was updated to ${loggerService.styleString(
                    String(rank),
                    THEMES.NICKNAME_STYLE
                )}`
            );
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                switch (error.message) {
                    case 'Missing Permissions':
                        loggerService.error(`${user.nickname} is located higher than bot`);
                        break;
                    default:
                        loggerService.error(`Unknown error: ${error.message}`);
                }
            }
        }
    }
}

export default new DiscordService();
