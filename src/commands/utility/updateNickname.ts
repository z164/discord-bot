import User from '../../entities/User';

export default async (nickname: string, id: string) => {
    try {
        await User.findOneAndUpdate({ discordID: id }, { nickname: nickname });
    } catch (err) {
        console.error(err);
    }
};
