import mongoose, {Mongoose} from 'mongoose';
import * as dotenv from 'dotenv';
import {title} from './commands/util/logUtilities';

dotenv.config();

class Mongo {
    private mongoose: Mongoose;

    constructor() {
        this.mongoose = mongoose;
    }

    async connect() {
        await this.mongoose.connect(process.env.NODE_ENV === 'test' ? process.env.TEST_URI : process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    }

    async disconnect() {
        await this.mongoose.disconnect();
        title('Mongo disconnected');
    }

    async bootstrap() {
        await this.connect();
        title('MongoDB ready');
    }

    getClient() {
        return this.mongoose;
    }
}

const instance = new Mongo();

export default instance;
