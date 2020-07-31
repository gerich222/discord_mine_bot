const Discord = require('discord.js');
const client = new Discord.Client();
const broadcast = client.voice.createBroadcast();
const ytdl = require('ytdl-core');
const queue = new Map();
const mysql = require('mysql2');
const message = require('discord.js')
var fs = require('fs');

const {
	prefix,
	token,
} = require('./config.json');
const { getInfo } = require('ytdl-core');
 
client.on('ready',  () => {
  console.log(`Logged in as ${client.user.tag}!` );
  client.user.setActivity('Human Destroy', { type: 'PLAYING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);
});

client.on('message', async message => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.guild) return;
    if (message.content ===  `${prefix}join`) {
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
      } else {
        message.reply('Idiot? You need to be in a voice channel!');
      }
    }
    if (!message.guild) return;
    if (message.content === `${prefix}leave`) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        }
        else {
            message.reply('Idiot? You need to be in a voice channel!');
          }
    }
    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
      } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
      } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
      } 
  });
  async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Idiot? You need to be in a voice channel!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I have no permmisions cuz i am nigger"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 2,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} added to queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Idiot, you need to be in a voice channel"
      );
    if (!serverQueue)
      return message.channel.send("Have no song whitch i can to skip");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Idiot? You need to be in a voice channel!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Started a new song: **${song.title}**`);
  }

  client.on('message', async message => {
      if (message.content === `${prefix}help`) {
          return message.channel.send(
          `
            =============================================================================
Commands of this bot:
.help - Help xd;
.join - just join to the voice channel
.play - write .play {link to the youtube link} then you can listen audio from youtube
.skip - just skip you dumbass
.stop - Stoping the audio :moyai:
.show gay - hehehehe
=============================================================================­`
          )}
  });

  client.on('message', async message => {
    if (message.content === `${prefix}afk`) {
      await client.user.setAFK == false;
    }
    if (message.content === `${prefix}online`) {
      await client.user.setAFK == true;
    }
  })

  
  client.on('message', async message => {
    if (message.content === `${prefix}show gay`) {
      await message.channel.send(`gay is ${message.guild.members.random()}`)
    }
  });
  client.on('message', async message => {
    if (message.content.startsWith(`${prefix}pin`)) {
      message.pin().then(() => message.channel.send(`${message.member}, your message pinned`));
    }})

client.login(token);