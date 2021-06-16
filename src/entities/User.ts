import { Schema, Types, model, Document } from 'mongoose';

export interface IUser extends Document {
    guildID: Types.ObjectId;
    discordID: string;
    nickname: string;
    dotaNickname: string;
    steam32ID: number;
    canEdit: boolean;
}

const userSchema: Schema = new Schema({
    guildID: {
        type: Types.ObjectId,
        ref: 'Guild',
    },
    discordID: {
        type: String,
    },
    nickname: {
        type: String,
    },
    dotaNickname: {
        type: String,
    },
    steam32ID: {
        type: Number
    },
    canEdit: {
        type: Boolean,
        default: true,
    },
});

export default model<IUser>('User', userSchema);
