const Discord = require('discord.js');
const client = new Discord.Client();
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
} = require('../../config.json');
const { config } = require('process');
module.exports = {
  name: 'inv',
  description: 'Inventory.',
  aliases: [],
  public: true,
  async execute(bot, message, args) {
    if(message.content === `${prefix}inv`) {
            let member = message.guild.member(message.mentions.users.first() || message.author)
            if(member.user.bot) return message.reply(`Bots not live.`)
            User.findOne({guildID: message.guild.id, userID: member.user.id}, (err,data) => {
            if(!data){
            let errorMess = new Discord.MessageEmbed()
            .setColor(`${data.color}`)
            .setDescription(`uff **${member.user.tag}** have no in database.`)
            return message.channel.send(errorMess)
            }
            let pf = new Discord.MessageEmbed()
            .setTitle(`${member.user.username}: Inventory[:baggage_claim:]`)
            .setThumbnail(`https://gamepedia.cursecdn.com/minecraft_gamepedia/b/b3/Chest.png`)
            .addFields(
                {name: `[🏴]Netherite`, value: `${data.netherite.toFixed(3)}`, inline: true},
                {name: `[💎]Diamonds`, value: `${data.diamonds.toFixed(3)}`, inline: true},
                {name: `[📀]Gold`, value: `${data.gold.toFixed(2)}`, inline: true},
                {name: `[⛓️]Iron`, value: `${data.iron.toFixed(1)}`, inline: true},
                {name: `[🖤]Coal`, value: `${data.coal.toFixed(2)}`, inline: true},
                {name: `[🗿]Cobblestone`, value: `${data.cobblestone}`, inline: true},
                {name: `[:one:]Wooden Picaxe`, value: `${data.wooden_picaxe}`, inline: true},
                {name: `[:two:]Stone Picaxe`, value: `${data.stone_picaxe}`, inline: true},
                {name: `[:three:]Iron Picaxe`, value: `${data.iron_picaxe}`, inline: true},
                {name: `[:four:]Golden Picaxe`, value: `${data.golden_picaxe}`, inline: true},
                {name: `[:five:]Diamond Picaxe`, value: `${data.diamond_picaxe}`, inline: true},
                {name: `[:six:]Netherite Picaxe`, value: `${data.netherite_picaxe}`, inline: true},
                )
            .setColor(`${data.color}`)
            .setFooter(`by gerich`)
            message.channel.send(pf)
        })
    }
  }
}
