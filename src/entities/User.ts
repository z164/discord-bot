import mongoose, {Schema, model, Document} from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = mongoose.Schema.Types.Long;

export interface IUser extends Document {
    guildID: Schema.Types.ObjectId;
    discordID: string;
    nickname: string;
    steam32ID: number;
    steam64ID: number;
    canEdit: boolean;
}

const userSchema: Schema = new Schema({
    guildID: {
        type: Schema.Types.ObjectId,
        ref: 'Guild',
    },
    discordID: {
        type: String,
    },
    nickname: {
        type: String,
    },
    steam32ID: {
        type: Number,
    },
    steam64ID: {
        type: Long,
    },
    canEdit: {
        type: Boolean,
        default: true,
    },
});

export default model<IUser>('User', userSchema);
