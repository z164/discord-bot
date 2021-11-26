import {Message} from 'discord.js';

export default (
    content: string,
    administrator = false,
    id = 'test',
    guildID = 'test',
    mentionID = 'test',
): Message => {
    return {
        author: {
            bot: false,
            id: id,
        },
        guild: {
            name: 'test',
            id: guildID,
        },
        channel: {
            send: jest.fn(),
        },
        member: {
            nickname: 'test',
            user: {
                id: id,
            },
            hasPermission: jest.fn(() => {
                return administrator;
            }),
        },
        mentions: {
            users: {
                first: jest.fn(() => {
                    return {
                        id: mentionID,
                    };
                }),
            },
        },
        content,
    } as unknown as Message;
};
