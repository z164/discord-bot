import {DiscordAPIError, GuildMember} from 'discord.js';
import {parse, THEMES} from '../commands/util/logUtilities';
import {IUser} from '../entities/User';
import User from '../repository/User';
import fetcherService, {FetcherService} from './fetcherService';
import loggerService from './loggerService';

export class NicknameService {
    private readonly fetcherService: FetcherService;

    constructor() {
        this.fetcherService = fetcherService;
    }

    async formatNickname(user: IUser, rank: string): Promise<string> {
        const {nickname} = user;
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
            const nicknameCut = `${nickname.slice(0, allowedNicknameLength)}...`;
            await User.updateOne(user._id, {
                nicknameNotShortened: nickname,
            });
            loggerService.warning(
                `${nickname}'s nickname was too big.\nIt have been cutted to ${nicknameCut}`,
            );
            return `${nicknameCut} ${rankInBracers}`;
        }
        return `${nickname} ${rankInBracers}`;
    }

    async updateRankInNickname(member: GuildMember, user: IUser): Promise<void> {
        if (!member) {
            loggerService.error(
                `${parse(user.nickname, THEMES.NICKNAME_STYLE)} is not present at current guild`,
            );
            await User.deleteOne(user._id);
            loggerService.warning(
                `${parse(user.nickname, THEMES.NICKNAME_STYLE)} is removed from database`,
            );
            return;
        }
        const rank = await this.fetcherService.fetchRank(user);
        try {
            const nicknameWithRank = await this.formatNickname(user, rank);
            if (member.nickname === nicknameWithRank) {
                loggerService.warning(`${user.nickname}'s rank have not been changed, skipping`);
                return;
            }
            await member.setNickname(nicknameWithRank, 'Nickname changed due to rank update');
            loggerService.log(
                `${loggerService.styleString(
                    user.nickname,
                    THEMES.NICKNAME_STYLE,
                )}'s rank was updated to ${loggerService.styleString(
                    String(rank),
                    THEMES.NICKNAME_STYLE,
                )}`,
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

export default new NicknameService();
