const discord = require('discord.js');
const mongoose = require('mongoose');

const register = require('./commands/register')
const setNicknames = require('./commands/setNicknames')
const editOwnDotaNickname = require('./commands/editOwnDotaNickname')
const canEditPermissionsSet = require('./commands/canEditPermissionsSet')
const setUsersDotaNickname = require('./commands/setUsersDotaNickname')
const getUsersDotaNickname = require('./commands/getUsersDotaNickname')
const help = require('./commands/help')

require('dotenv').config()

const client = new discord.Client()
client.login(process.env.BOT_TOKEN)

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    console.log('MongoDB cluster connection established')
})

const messageHandle = async (message) => {
    if (message.author.bot) {
        return;
    }
    const [prefix, command, ...body] = message.content.split(' ')
    if (prefix !== process.env.prefix) {
        return
    }
    console.log(message.content.split(' '))
    switch (command) {
        case 'register':
            register(message, body)
            break
        case 'update':
            setNicknames(message)
            break
        case 'edit':
            editOwnDotaNickname(body, message)
            break
        case 'help':
            help(message.channel)
            break
        case 'lock':
            canEditPermissionsSet(message, false)
            break
        case 'unlock':
            canEditPermissionsSet(message, true)
            break
        case 'get':
            getUsersDotaNickname(message)
            break
        case 'set':
            setUsersDotaNickname(message, body)
            break
        default:
            message.channel.send('Unknown command')
            break
    }
}

client.on('message', messageHandle)