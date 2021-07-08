import {FilterQuery, UpdateQuery, Types, Model} from 'mongoose';
import GuildModel, {GuildObj, IGuild} from '../entities/Guild';

class Guild {
    private readonly model: Model<IGuild>;

    constructor(model: Model<IGuild>) {
        this.model = model;
    }

    async findMany(query?: FilterQuery<IGuild>): Promise<IGuild[]> {
        return this.model.find(query);
    }

    async findOne(query: FilterQuery<IGuild> | Types.ObjectId): Promise<IGuild> {
        if (query instanceof Types.ObjectId) {
            return this.model.findById(query);
        }
        return this.model.findOne(query);
    }

    async updateOne(query: FilterQuery<IGuild> | Types.ObjectId, update: UpdateQuery<IGuild>) {
        if (query instanceof Types.ObjectId) {
            return this.model.findById(query);
        }
        return this.model.findOneAndUpdate(query, update);
    }

    async create(guild: GuildObj): Promise<IGuild> {
        return this.model.create(guild);
    }

    async deleteOne(query: FilterQuery<IGuild> | Types.ObjectId) {
        if (query instanceof Types.ObjectId) {
            return this.model.findByIdAndDelete(query);
        }
        return this.model.findOneAndDelete(query);
    }
}

export default new Guild(GuildModel);
