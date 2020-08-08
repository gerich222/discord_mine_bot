const mongoose = require('mongoose')
const Discord = require('discord.js');
const prefix = require('../config.json')
const schema = mongoose.Schema({
    Username: String,
    color: {type: String, default: 'RED'},
    guildID: String,
    userID: String,
    bio: {type: String, default: `Amateur`},
    money: { type: Number, default: 0, min: 0 },
    messages: { type: Number, default: 0, min: 0 },
    diamonds: { type: Number, default: 0, min: 0},
    gold: { type: Number, default: 0, min: 0},
    iron: { type: Number, default: 0, min: 0},
    coal: { type: Number, default: 0, min: 0},
    cobblestone: { type: Number, default: 1, min: 0},
    netherite: { type: Number, default: 0, min: 0},
    netherite_picaxe: { type: Number, default: 0, max: 1, min: 0},
    diamond_picaxe: { type: Number, default: 0, max: 1, min: 0 },
    golden_picaxe: { type: Number, default: 0, max: 1, min: 0},
    iron_picaxe: { type: Number, default: 0, max: 1, min: 0},
    stone_picaxe: { type: Number, default: 0, max: 1, min: 0},
    wooden_picaxe: { type: Number, default: 0, max: 1, min: 0},
});
module.exports = mongoose.model("User", schema)
