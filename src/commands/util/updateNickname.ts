import User from '../../repository/User';
import Guild from '../../repository/Guild';

export default async (nickname: string, userID: string, guildID: string): Promise<void> => {
    try {
        const guild = await Guild.findOne({guildID});
        await User.updateOne({discordID: userID, guildID: guild._id}, {nickname});
    } catch (err) {
        console.error(err);
    }
};
