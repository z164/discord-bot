import {readFileSync} from 'fs';
import {UserObj} from '../../entities/User';
import User from '../../repository/User';

export default async function () {
    const usersString = readFileSync('./src/tests/mocks/data/Users.json').toString();
    const usersObj: UserObj[] = JSON.parse(usersString);
    for (const user of usersObj) {
        await User.create(user);
    }
}
