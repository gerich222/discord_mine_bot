const mongoose = require('mongoose')
const prefix = require('../config.json')
const schema = mongoose.Schema({
    guildID: String,
});
module.exports = mongoose.model("Guild", schema)
