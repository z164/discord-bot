import mongo from '../mongo';
import discord from '../discord';
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
import editOwnSteam32IDTest from './commands/editOwnSteam32IDTest';
import getRankTest from './commands/getRankTest';
import getUsersSteam32IDTest from './commands/getUsersSteam32IDTest';

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

    describe('guildDelete', guildDeleteTest);

    describe('parseRank', parseRankTest);

    describe('updateNickname', updateNicknameTest);

    describe('validateSteam32ID', validateSteam32IDTest);

    describe('canEditPermissionsSet', canEditPermissionsSetTest);

    describe('editOwnSteam32ID', editOwnSteam32IDTest);

    describe('getRank', getRankTest);

    describe('getUsersSteam32ID', getUsersSteam32IDTest);

    afterAll(async () => {
        await mongo.getClient().connection.db.dropDatabase();
        await mongo.disconnect();
        await discord.disconnect();
    });
});
