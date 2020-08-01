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
} = require('../../config.json');
const { getInfo } = require('ytdl-core');
const { listenerCount } = require('process');
const { join } = require("path");
module.exports = {
  name: 'ping',
  description: 'ping',
  aliases: [],
  public: true,
  async execute(bot, message, args) {
    if (message.content === `${prefix}ping`) {
      let startDate = Date.now();
    let a = new Discord.MessageEmbed()
   .setDescription(`heartbeat: ${Date.now() - message.createdTimestamp}ms\nResponse api Discord: ${bot.ping | 0 }ms`)
    .setColor('GREEN')
    message.channel.send(a)
    }
  }
}
