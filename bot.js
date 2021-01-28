const discord = require('discord.js');
const mongoose = require('mongoose');

const axios = require('axios')

const User = require('./Database/User')

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

const register = async (member, body, channel, message) => {
    let discordID = member.user.id
    if(message.author.id === message.guild.ownerID) {
        message.guild.me.setNickname(member.nickname ?? member.username)
        discordID = message.guild.me.id
    }
    const dotaNickname = body.join(' ').trim()
    if (dotaNickname === '') {
        channel.send('No nickname provided')
        return
    }
    const user = await User.findOne({
        discordID: discordID
    })
    if (user) {
        channel.send('You are already registered')
        return
    }
    User.create({
        discordID: discordID,
        nickname: member.nickname ?? member.user.username,
        dotaNickname: dotaNickname,
        canEdit: true
    }, (err) => {
        if (err) {
            channel.send(err)
        } else {
            channel.send(`Registered succesfully:\nID: ${member.user.id}\nNickname: ${member.nickname ?? member.user.username}\nDota Nickname: ${dotaNickname}`)
        }
    })
}


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
            register(message.member, body, message.channel, message)
            break
        case 'update':
            setNicknames(message)
            break
        case 'edit':
            editDotaNickname(message.member, body, message.channel)
            break
        case 'help':
            sendHelp(message.channel)
            break
        case 'lock':
            canEditPermissionsSet(message, false)
            break
        case 'unlock':
            canEditPermissionsSet(message, true)
            break
        case 'get':
            get(message)
            break
        case 'set':
            set(message, body)
            break
        default:
            message.channel.send('Unknown command')
            break
    }
}

client.on('message', messageHandle)

const setNicknames = async (message) => {
    axios.get('http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=europe&leaderboard=0')
        .then(async (response) => {
            const {
                data
            } = response
            const users = await User.find({})
            users.forEach(user => {
                const player = data.leaderboard.find(el => {
                    return el.name.toLowerCase() === user.dotaNickname.toLowerCase();
                });

                message.guild.members.fetch(user.discordID)
                    .then((response) => {
                        try {
                            if (player) {
                                response.setNickname(`${user.nickname} [${player.rank}]`, 'Nickname changed due to rank update');
                            } else {
                                response.setNickname(`${user.nickname}`, 'This player is not present on leaderboards')
                            }
                        } catch (err) {
                            console.log('I cant change server owner`s nickname :(')
                        }
                    })
            });
        })

}

const editDotaNickname = async (member, body, channel) => {
    const bodyStr = body.join(' ').trim()
    if (bodyStr === '') {
        channel.send('No nickname provided')
        return
    }
    const currentUser = await User.findOne({
        discordID: member.user.id
    })
    if (currentUser === null) {
        channel.send('You are not registered')
        return
    }
    if (!currentUser.canEdit) {
        channel.send('You were banned from editing your nickname')
        return
    }
    await User.findOneAndUpdate({
        discordID: member.user.id
    }, {
        dotaNickname: bodyStr
    }, (err, res) => {
        if (err) {
            console.error(err)
        } else {
            channel.send('Your nickname was updated succesfully')
        }
    })
}

const canEditPermissionsSet = async (message, parameter) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    const idToBan = message.mentions.users.first().id
    console.log(idToBan)
    await User.findOneAndUpdate({
        discordID: idToBan
    }, {
        canEdit: parameter
    }, (err, res) => {
        if (err) {
            console.error(err)
        } else {
            message.channel.send(`${res.dotaNickname} ${parameter ? 'can now edit his nickname' : 'can no longer edit his nickname'}`)
        }
    })
}

const get = async (message) => {
    if(!message.mentions.users.first()) {
        message.channel.send('No user mentioned')
        return
    }
    const idToGet = message.mentions.users.first().id
    const user = await User.findOne({
        discordID: idToGet
    })
    if (user === null) {
        message.channel.send(`This user is not registered in system`)
        return
    }
    message.channel.send(`${user.nickname}'s Dota 2 nickname is ${user.dotaNickname}`)
}

const set = async (message, body) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send('You need administrator permissions on server to do this')
        return
    }
    if(!message.mentions.users.first()) {
        message.channel.send('No user mentioned')
        return
    }
    body.shift()
    const bodyStr = body.join(' ').trim()
    const idToSet = message.mentions.users.first().id
    await User.findOneAndUpdate({
        discordID: idToSet
    }, {
        dotaNickname: bodyStr
    }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            if (res === null) {
                message.channel.send(`This user is not registered in system`)
            } else {
                message.channel.send(`Changed ${res.nickname}'s Dota 2 nickname to ${bodyStr}`)
            }
        }
    })
}

const sendHelp = async (channel) => {
    channel.send(`**Hello, there!**\nThis bot appends your rank from leaderboards to your nickname\nz! register *%your_official_dota2_nickname_from_leaderboards%* - registers your nickname in bot\n**Bot cannot change server owner's nickname**, so if you are a server owner, bot will take your nickname and append rank to it\nz! edit *%new_nickname%* - edits your nickname\nz! update - updates ranks of registered players that present on leaderboards\nz! lock *%user_mention%* - prevent user from changing his Dota 2 nickname (Admin only) \nz! unlock *%user_mention%* - allow user to change his Dota 2 nickname (Admin only)\nz! get *%user_mention%* - get user's Dota 2 nickname\nz! set *%user_mention%* - set user's Dota 2 nickname (Admin only)\nFeedback: **@z164#2176**\nSmiley face :)\n\n(still beta, would be improved)`)
}

// setNicknames()

// setInterval(setNicknames, 3600000)

// // rulesDefender(message.channel)
// message.channel.send('message.author.username: ' + message.author.username)
// message.channel.send('message.author.discriminator: ' + message.author.discriminator)
// message.channel.send('message.content: ' + message.content)
// // console.log(message)
// // console.log(message.guild.members)
// // console.log(message.guild.channels)
// // console.log(message.guild.roles)
// // console.log(message.member)
// message.channel.send('guild.name: ' + message.guild.name)
// message.channel.send('message.member._roles: ' + message.member._roles)
// // message.channel.send
// // console.log(message.guild.roles)
// // console.log(getRolesNames(message.member._roles, message.guild.roles.cache))
// message.channel.send('getRolesNames output: ' + [...getRolesNames(message.member._roles, message.guild.roles.cache)])


// const getRolesNames = (rolesMember, rolesGuild) => {
//     const res = []
//     rolesGuild.forEach((value, key) => {
//         if (rolesMember.includes(key)) {
//             res.push(value.name)
//         }
//     })
//     return res
// }

// const rulesDefender = (channel) => {
//     if (channel.name === 'rules') {
//         channel.send()
//     }
// }