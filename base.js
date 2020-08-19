const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
client.commands = new Discord.Collection();
bot.commands = new Discord.Collection()
global.ms = require('ms')
global.config = require('./config.json')
global.fs = require('fs')
const broadcast = client.voice.createBroadcast();
const ytdl = require('ytdl-core');
const queue = new Map();
const fs = require('fs');
const mongoose = require('mongoose');
const requireAll = require('require-all')
global.Guild = require("./data/guild.js");
global.User = require('./data/user.js');
bot.commands = new Discord.Collection()
const { readdirSync } = require("fs");

const colors = [
    'RED', 
    'GREEN', 
    'WHITE',
    'AQUA', 
    'BLUE',
    'YELLOW',
    'PURPLE',
    'LUMINOUS_VIVID_PINK;PINK',
    'GOLD',
    'ORANGE',
    'GREY',
    'DARKER_GREY',
    'NAVY',
    'DARK_AQUA',
    'DARK_GREEN',
    'DARK_BLUE',
    'DARK_PURPLE',
    'DARK_VIVID_PINK;DARK_PINK',
    'DARK_GOLD',
    'DARK_ORANGE',
    'DARK_RED',
    'DARK_GREY',
    'LIGHT_GREY',
    'DARK_NAVY',
    'RANDOM'
] // 25
    

const {
    prefix,
    token,
    dataURL,
    apiKey,
    sceID,
} = require('./config.json');
const { getInfo } = require('ytdl-core');
const { listenerCount } = require('process');
const { join } = require("path");
mongoose.connect(dataURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('[✅DataBase] Connected!')
})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('.help', { type: 'LISTENING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);

});

client.on("message", async message => {
    Guild.findOne({ guildID: message.guild.id }, (err, res) => {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const serverQueue = queue.get(message.guild.id);
  
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
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.video_url,
      url: songInfo.videoDetails.video_url
    };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
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
      let queueinfo = new Discord.MessageEmbed()
      .setColor(`RED`)
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
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
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
    let playinfo = new Discord.MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Start playing: ${song.title}`)
    serverQueue.textChannel.send(playinfo);
  }})
  



client.on('message', async message => {
    if (message.channel.type == 'dm') return;
    if (message.content === `${prefix}afk`) {
        await client.user.setAFK == false;
    }
    if (message.content === `${prefix}online`) {
        await client.user.setAFK == true;
    }
    if (message.content === `${prefix}id`){
        await message.channel.send(message.author.id)
    }
})




client.on('message', async (message) => {
    if (message.channel.type == 'dm') return;
    Guild.findOne({ guildID: message.guild.id }, (err, res) => {
        if (err) return message.channel.send(`[❌DataBase] error to add you to database`)
        if (!res) {
            let guild = new Guild({ guildID: message.guild.id })
            console.log(`\`[✅DataBase]\` **${message.guild.name}** succsesful adding to database`)
            guild.save().catch(err => message.channel.send(`\`[❌DataBase]\` error for databases. error: \`\`\`${err}\`\`\``));
        } else {
            if (!message.content.startsWith(`${prefix}`)) return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmdName = args.shift().toLowerCase();
            const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
            if (!require('./config.json').owner.includes(message.author.id)) return;
            command.execute(bot, message, args);
        }
    })
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    User.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, res, data) => {
        if(message.content === `${prefix}buy_wpix`){
                if(err) {
                    message.channel.send(`error: ${err}`)
                }
                if(res.money < 150){
                    message.channel.send(`You have not enough money`)
                }
                if(!res.wooden_picaxe == 0) {
                    message.channel.send(`You have enough picaxes`)
                }
                if( res.money > 150 && res.wooden_picaxe == 0) {
                    res.money -= 150
                    res.wooden_picaxe += 1
                    message.channel.send(`You buyed a new picaxe`)
            }
        }
        if(message.content === `${prefix}buy_spix`){
            if(err) {
                message.channel.send(`error: ${err}`)
            }
            if(res.cobblestone < 150){
                message.channel.send(`You have not enough cobblestone`)
            }
            if(!res.stone_picaxe == 0) {
                message.channel.send(`You have enough picaxes`)
            }
            if( res.cobblestone > 100 && res.stone_picaxe == 0) {
                res.cobblestone -= 100
                res.stone_picaxe += 1
                message.channel.send(`You buyed a new picaxe`)
        }
    } 
    if(message.content === `${prefix}buy_ipix`){
        if(err) {
            message.channel.send(`error: ${err}`)
        }
        if(res.iron < 50){
            message.channel.send(`You have not enough iron`)
        }
        if(!res.iron_picaxe == 0) {
            message.channel.send(`You have enough picaxes`)
        }
        if( res.money > 50 && res.iron_picaxe == 0) {
            res.iron -= 50
            res.iron_picaxe += 1
            message.channel.send(`You buyed a new picaxe`)
    }
}
if(message.content === `${prefix}buy_gpix`){
    if(err) {
        message.channel.send(`error: ${err}`)
    }
    if(res.gold < 25){
        message.channel.send(`You have not enough gold`)
    }
    if(!res.golden_picaxe == 0) {
        message.channel.send(`You have enough picaxes`)
    }
    if( res.gold > 50 && res.golden_picaxe == 0) {
        res.gold -= 50
        res.golden_picaxe += 1
        message.channel.send(`You buyed a new picaxe`)
}
} 
if(message.content === `${prefix}buy_dpix`){
    if(err) {
        message.channel.send(`error: ${err}`)
    }
    if(res.diamonds < 10){
        message.channel.send(`You have not enough diamonds`)
    }
    if(!res.diamond_picaxe == 0) {
        message.channel.send(`You have enough picaxes`)
    }
    if( res.diamonds > 10 && res.diamond_picaxe == 0) {
        res.diamonds -= 10
        res.diamond_picaxe += 1
        message.channel.send(`You buyed a new picaxe`)
}
} 
if(message.content === `${prefix}buy_npix`){
    if(err) {
        message.channel.send(`error: ${err}`)
    }
    if(res.netherite < 5){
        message.channel.send(`You have not enough netherite`)
    }
    if(!res.netherite_picaxe == 0) {
        message.channel.send(`You have enough picaxes`)
    }
    if(!res.diamond_picaxe == 0){
        message.channel.send(`You haven't diamond picaxe to buy netherite picaxe`)
    }
    if( res.netherite > 5 && res.netherite_picaxe == 0 && res.diamond_picaxe == 1) {
        res.netherite -= 5
        res.netherite_picaxe += 1
        res.diamond_picaxe -= 1
        message.channel.send(`You buyed a new picaxe`)
}
} 
        if (err) return message.channel.send(`\`[❌DataBase]\` error to add database`)
        if (!res) {
            let user = new User({ guildID: message.guild.id, userID: message.author.id, Username: message.author.username
             })
            console.log(`\`[✅DataBase]\` **${message.author.username}** succsesful added to database`)
            user.save().catch(err => message.channel.send(`\`[❌DataBase]\` i cant add you to database. error: \`\`\`${err}\`\`\``));
        } else {
            if( res.wooden_picaxe == 1){
                res.cobblestone++
                res.coal += 0.4
            }
            if ( res.stone_picaxe == 1){
                res.cobblestone++
                res.coal +=0.4
                res.iron += 0.1
            }
            if(res.iron_picaxe == 1){
                res.cobblestone++
                res.coal += 0.4
                res.iron += 0.1
                res.gold +=0.05
                res.diamonds +=0.003
            }
            if(res.golden_picaxe == 1){
                res.cobblestone++
                res.coal +=0.4
                res.iron += 0.1
            }
            if(res.diamond_picaxe == 1) {
                res.cobblestone++
                res.coal += 0.4
                res.iron += 0.1
                res.gold +=0.05
                res.diamonds +=0.003
                res.netherite += 0.001
            }
            if(res.netherite_picaxe == 1){
                res.cobblestone++
                res.coal += 0.4
                res.iron += 0.1
                res.gold +=0.05
                res.diamonds +=0.003
                res.netherite += 0.001
            }
            let random = Math.floor(Math.random() * 3)
            res.money += random
            res.messages++
            res.save()
        }
        
    if (message.content === `${prefix}color help`){
        let color_help = new Discord.MessageEmbed()
        .setColor(`${res.color}`)
        .setTitle(`Colors:`)
        // .setDescription(`red\ngreen\nwhite\naqua\nblue\nyellow\npurple\npink\ngold\norange\ngrey\ndarker grey\nnavy\ndark aqua\ndark green\ndark blue\ndark purple\ndark pink\ndark gold\ndark orange\ndark red\ndark grey\nlight grey\ndark navy\nrandom`)
        .setDescription(colors.map(e=>e.split(';').pop().replace('_', ' ').toLowerCase()).join('\n'))
        .setThumbnail(`https://i.stack.imgur.com/01XJ7.png`)
        .setFooter(`by gerich`)
        message.channel.send(color_help)
    }
    const [cmd, ...arguments] = message.content.slice(prefix.length).split(/ +/g);
        if(cmd == 'bio') {
                    res.discordbio = arguments.join(" ");
                    let bioalert = new Discord.MessageEmbed()
                    .setTitle(`Bio was changed`)
                    .setColor(`${res.color}`)
                    .setFooter(`by gerich`)
                    message.channel.send(bioalert)
        }

    const checkColorCommand = (message = '') => {
        const regExp = new RegExp(`${prefix}color ([a-z\\s]+)`)
        const execArray = regExp.exec(message)

        if(!execArray)
            return null

        return execArray[1].trim().toUpperCase()
    }

    const changeColor = checkColorCommand(message.content)
    
    if(changeColor) {
        for(let color of colors) {
            let colorSplited = color.split(';')
            let data = colorSplited.map(e => e.trim().replace('_', ' '))

            if(data.indexOf(changeColor) !== -1) {
                res.color = colorSplited[0]
                let coloralert = new Discord.MessageEmbed()
                .setTitle(`Color was changed`)
                .setColor(res.color)
                .setFooter(`by gerich`)
                message.channel.send(coloralert)
                break
            }
        }
    }
    

    let shophelp = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setTitle(`Shop commands`)
    // .setDescription(`.buy_wpix - buy wooden picaxe\n.buy_spix - buy stone picaxe\n.buy_ipix - buy iron picaxe\n.buy_gpix - buy golden picaxe\n.buy_dpix - buy diamond picaxe\n.buy_npix - buy netherite picaxe\n`)
    .addFields(
        {name: `[:one:]Wooden Picaxe`, value: `.buy_wpix`, inline: true},
        {name: `[:two:]Stone Picaxe`, value: `.buy_spix`, inline: true},
        {name: `[:three:]Iron Picaxe`, value: `.buy_ipix`, inline: true},
        {name: `[:four:]Golden Picaxe`, value: `.buy_gpix`, inline: true},
        {name: `[:five:]Diamond Picaxe`, value: `.buy_dpix`, inline: true},
        {name: `[:six:]Netherite Picaxe`, value: `.buy_npix`, inline: true},
    )
    .setFooter(`by gerich`)
    if(message.content === `${prefix}shop help`){
        message.channel.send(shophelp)
    }
    
    let helpembed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setTitle(`Help`)
    .setDescription(`.help - Help xd\n.join - just join to the voice channel\n.play - write .play {link to the youtube link} then you can listen audio from youtube\n.skip - just skip you dumbass\n.stop - Stoping the audio :moyai:\n.inv - shows your inventory\n.profile - shows your profile(updates coming soon)\n.ping - show the bot ping\n.show gay - hehehehe­\n.color {color} - set your color which you want (.color help for colors)\n.shop - shop menu\n.shop help - show you shop menu commands`)
    .setFooter(`by gerich`)
        if (message.content === `${prefix}help`) {
            message.channel.send(helpembed)
        }
})


    
});
/**
 * Gets all files from given directory, 
 * optionally get all files from subfolders 
 * if `recursive` option set to true or not provided
 * @param {string} dir Directory to read files from
 * @param {boolean} recursive if this func should read files from subfolders
 */
function getFiles(dir, recursive = true) {
    const directory = readdirSync(dir, { withFileTypes: true });
    const files = [];
    const length = directory.length;
    for (let index = 0; index < length; index++) {
        const dirent = directory[index];
        const name = join(dir, dirent.name);
        if (recursive && dirent.isDirectory()) {
            files.push.apply(files, getFiles(name));
        } else {
            files.push(name);
        }
    }
    return files;
}

; (() => {
    const files = getFiles(join(__dirname, 'commands'));
    const length = files.length;
    for (let index = 0; index < length; index++) {
        const file = files[index];
        if (file.endsWith('.js')) {
            const module = require(file);
            if (typeof module.execute === "function" || typeof module.run === "function") {
                client.commands.set(module.name, module);
            }
        }
    }
})();


client.on('message', async message => {
    if (message.channel.type == 'dm') return;
    let content = message.content;
    if (!message.author.bot || content.startsWith(prefix)) {
        content = content.slice(prefix.length);
        const command = client.commands.find(command => {
            const names = (command.aliases || []).concat(command.name);
            const name = names.find(name => name.startsWith(content));
            if (name) {
                content = content.slice(name).trim();
                return true;
            }
        });
        if (command) {
            if (command.guildOnly && !msg.guild) return;
            (command.run || command.execute).call(client, client, message, content);
        }
    }
});
client.on('message', async message => {
    if (message.content === `${prefix}show gay`) {
        let winner = message.guild.members.cache.random().user;
        message.channel.send(`Now ${winner} is gay`);
    }
});
client.login(token);
