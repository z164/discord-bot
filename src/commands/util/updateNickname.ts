import UserModel from '../../entities/User';
import GuildModel from '../../entities/Guild';

export default async (nickname: string, userID: string, guildID: string) => {
    try {
        const guild = await GuildModel.findOne({guildID: guildID});
        await UserModel.findOneAndUpdate({discordID: userID, guildID: guild._id}, {nickname: nickname});
    } catch (err) {
        console.error(err);
    }
};
