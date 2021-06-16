import { TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { parse, title, themes, separator } from './util/logUtilities';

export default async (channel: TextChannel | DMChannel | NewsChannel) => {
    title('Help');
    channel.send(
        "**Hello, there!**\nThis bot appends your rank from leaderboards to your nickname\nz! register *%your_official_dota2_nickname_from_leaderboards%* - registers your nickname in bot\n**Bot cannot change server owner's nickname**, so if you are a server owner, bot will take your nickname and append rank to it\nz! edit *%new_nickname%* - edits your nickname\nz! update - updates ranks of registered players that present on leaderboards\nz! lock *%user_mention%* - prevent user from changing his Dota 2 nickname (Admin only)\nz! unlock *%user_mention%* - allow user to change his Dota 2 nickname (Admin only)\nz! get *%user_mention%* - get user's Dota 2 nickname\nz! set *%user_mention%* - set user's Dota 2 nickname (Admin only)"
    );
    channel.send(
        'Feedback: **@z164#2176**\nGithub page: https://github.com/z164/discord-bot\nSmiley face :)\n\n(still beta, would be improved)'
    );
    console.log(parse('Help was sent', themes.log));
    console.log(separator);
};
