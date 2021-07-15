import mongo from '../mongo';
import fillGuilds from './mocks/fillGuilds';
import fillUsers from './mocks/fillUsers';

import messageHandleTest from './handlers/messageHandleTest';

import canEditPermissionsSetTest from './commands/canEditPermissionsSetTest';

import getUserFromMentionTest from './commands/util/getUserFromMentionTest';

import getAuthorAsUserTest from './commands/util/getAuthorAsUserTest';
import guildDeleteTest from './commands/util/guildDeleteTest';
import parseRankTest from './commands/util/parseRankTest';
import updateNicknameTest from './commands/util/updateNicknameTest';
import validateSteam32IDTest from './commands/util/validateSteam32IDTest';

describe('Tests', () => {
    beforeAll(async () => {
        jest.spyOn(console, 'log').mockImplementation(() => null);
        await mongo.bootstrap();
        await mongo.getClient().connection.db.dropDatabase();
        await fillGuilds();
        await fillUsers();
    });

    describe('messageHandle', messageHandleTest);

    describe('getUserFromMention', getUserFromMentionTest);

    describe('getAuthorAsUser', getAuthorAsUserTest);
    
    describe('guildDelete', guildDeleteTest)

    describe('parseRank', parseRankTest)

    describe('updateNickname', updateNicknameTest)

    describe('validateSteam32ID', validateSteam32IDTest)

    describe('canEditPermissionsSet', canEditPermissionsSetTest);

    afterAll(async () => {
        await mongo.getClient().connection.db.dropDatabase();
    });
});
