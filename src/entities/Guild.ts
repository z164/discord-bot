import mongoose, { Document, Schema } from 'mongoose';

export interface IGuild extends Document {
    guildID: string,
    name: string
}

const guildSchema: Schema = new mongoose.Schema({
    guildID: {
        type: String
    },
    name: {
        type: String
    }
});

export default mongoose.model<IGuild>('Guild', guildSchema);
