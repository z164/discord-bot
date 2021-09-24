import {FilterQuery, Model, NativeError, Types, UpdateQuery} from 'mongoose';
import UserModel, {IUser, UserObj} from '../entities/User';

class User {
    private readonly model: Model<IUser>;

    constructor(model: Model<IUser>) {
        this.model = model;
    }

    async findMany(query?: FilterQuery<IUser>): Promise<IUser[]> {
        return this.model.find(query);
    }

    async findOne(query: FilterQuery<IUser> | Types.ObjectId): Promise<IUser> {
        if (query instanceof Types.ObjectId) {
            return this.model.findById(query);
        }
        return this.model.findOne(query);
    }

    async updateOne(query: FilterQuery<IUser> | Types.ObjectId, update: UpdateQuery<IUser>) {
        if (query instanceof Types.ObjectId) {
            return this.model.findById(query);
        }
        return this.model.findOneAndUpdate(query, update);
    }

    async create(user: UserObj, callback?: (err: NativeError, doc: IUser) => void): Promise<IUser | void> {
        if (callback) {
            return this.model.create(user, callback);
        }
        return this.model.create(user);
    }

    async deleteMany(query: FilterQuery<IUser>) {
        return this.model.deleteMany(query);
    }

    async deleteOne(query: FilterQuery<IUser> | Types.ObjectId) {
        if (query instanceof Types.ObjectId) {
            return this.model.findByIdAndDelete(query);
        }
        return this.model.deleteOne(query);
    }
}

export default new User(UserModel);
