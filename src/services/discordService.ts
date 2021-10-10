import {Client, Guild, Message, MessageReaction} from 'discord.js';
import * as dotenv from 'dotenv';

import fetcherService, {FetcherService} from './fetcherService';

import DBotError from '../entities/errors/DBotError';

dotenv.config();

class DiscordService {
    private readonly fetcherService: FetcherService;

    constructor() {
        this.fetcherService = fetcherService;
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

    async sendMessage(message: Message, messageToSend: string): Promise<Message> {
        return message.channel.send(messageToSend);
    }

    async reactWithEmoji(message: Message, emoji: string): Promise<MessageReaction> {
        return message.react(emoji);
    }
}

export default new DiscordService();
