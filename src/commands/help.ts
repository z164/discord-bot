import {Message} from 'discord.js';
import discordService from '../services/discordService';
import loggerService from '../services/loggerService';

export default async (message: Message): Promise<void> => {
    loggerService.title('Help');
    discordService.sendMessage(
        message,
        "**Hello, there!**\nThis bot appends your Dota 2 rank to your nickname\nz! register *%Steam 32ID%* - registers your nickname in bot\n**Bot cannot change server owner's nickname**, so if you are a server owner, bot will take your nickname and append rank to it\nz! edit *%Steam 32ID%* - edits your steamID\nz! update - updates ranks of registered players\nz! lock *%user_mention%* - prevent user from changing his Steam ID (Admin only)\nz! unlock *%user_mention%* - allow user to change his Steam ID (Admin only)\nz! getRank *%Steam 32ID%* - fetches rank of any player by his Steam 32ID\nz! get *%user_mention%* - get user's Steam ID\nz! set *%user_mention%* - set user's Steam ID (Admin only)",
    );
    discordService.sendMessage(
        message,
        'Feedback: **@z164#6241**\nGithub page: https://github.com/z164/discord-bot',
    );
    loggerService.log('Help was sent');
    loggerService.separator();
};
