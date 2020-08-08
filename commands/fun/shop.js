const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const bot = new Discord.Client();
client.commands = new Discord.Collection();
bot.commands = new Discord.Collection()
global.ms = require('ms')
global.config = require('../../config.json')
global.fs = require('fs')
const broadcast = client.voice.createBroadcast();
const ytdl = require('ytdl-core');
const queue = new Map();
// Зачем???
// const message = require('discord.js')
const fs = require('fs');
const mongoose = require('mongoose');
const requireAll = require('require-all')
global.Guild = require("../../data/guild.js");
global.User = require('../../data/user.js');
bot.commands = new Discord.Collection()
const { readdirSync } = require("fs");

const {
    prefix,
    token,
    dataURL,
    warn,
    bio,
    apiKey,
    sceID
} = require('../../config.json');
const { config } = require('process');
const user = require('../../data/user');
module.exports = {
    name: 'shop',
    description: 'shop',
    aliases: [],
    public: true,
    async execute(bot, message, args) {
        
            
        
        
        if (message.content === `${prefix}shop`){
            let member = message.guild.member(message.mentions.users.first() || message.author)
            User.findOne({guildID: message.guild.id, userID: member.user.id}, (err,data) => {
                let shopembed = new Discord.MessageEmbed()
            .setTitle(`Shop`)
            .setThumbnail(`https://minecraftcommand.science/images/villager/librarian.png`)
            .addFields(
                {name: `[:one:]Wooden Picaxe`, value: `150﷼`, inline: true},
                {name: `[:two:]Stone Picaxe`, value: `100 Cobblestone`, inline: true},
                {name: `[:three:]Iron Picaxe`, value: `50 Iron`, inline: true},
                {name: `[:four:]Golden Picaxe`, value: `30 Gold`, inline: true},
                {name: `[:five:]Diamond Picaxe`, value: `10 Diamond`, inline: true},
                {name: `[:six:]Netherite Picaxe`, value: `5 Netherite, diamond picaxe`, inline: true},
            )
            .setColor(`${data.color}`)
            .setFooter(`${prefix}shop help - for help`)
            message.channel.send(shopembed)
            
        }
            )}}}