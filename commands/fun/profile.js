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
  name: 'pf',
  description: 'Whathcing profile.',
  aliases: ["profile","$","balance","bal"],
  public: true,
  async execute(bot, message, args) {
    let member = message.guild.member(message.mentions.users.first() || message.author)
    if(member.user.bot) return message.reply(`Bot have no life.`)
    User.findOne({guildID: message.guild.id, userID: member.user.id}, (err,data) => {
    if(!data){
      let errorMess = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`uff **${member.user.tag}** have no in data base.`)
      return message.channel.send(errorMess)
    }
    let pf = new Discord.MessageEmbed()
    .setTitle(`User profile: ${member.user.username}`)
    .setDescription(`[💸] Money: ${data.money || 0}\n[📧] Messages: ${data.messages || 0}`)
    message.channel.send(pf)
    })
  }
}
