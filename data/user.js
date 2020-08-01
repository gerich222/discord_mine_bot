const mongoose = require('mongoose')
const prefix = require('../config.json')
const schema = mongoose.Schema({
    guildID: String,
    userID: String,
    money: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    diamonds: { type: Number, default: 0},
    gold: { type: Number, default: 0},
    iron: { type: Number, default: 0},
    coal: { type: Number, default: 0},
    cobblestone: { type: Number, default: 0},
});
module.exports = mongoose.model("User", schema)
