const setNicknames = require('../setNicknames')

const curry = (client, guildID) => {
    return () => setNicknames(client, guildID)
}

const intervals = []

const createInterval = (client, guildID) => {
    const interval = setInterval(curry(client, guildID), 10000)
    intervals.push({
        guildID: guildID,
        interval: interval
    })
}

const removeInterval = (guildID) => {
    const interval = intervals.find(el => el.guildID === guildID)
    clearInterval(interval.interval)
}

module.exports = {
    createInterval,
    removeInterval
}