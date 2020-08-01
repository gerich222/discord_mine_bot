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
// Зачем???
// const message = require('discord.js')
const fs = require('fs');
const mongoose = require('mongoose');
const requireAll = require('require-all')
global.Guild = require("./data/guild.js");
global.User = require('./data/user.js');
bot.commands = new Discord.Collection()
const { readdirSync } = require("fs");

const {
    prefix,
    token,
    dataURL,
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

client.on('message', async message => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.guild) return;
    if (message.content === `${prefix}join`) {
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
let helpembed = new Discord.MessageEmbed()
            .setTitle(`Help`)
            .setDescription(`.help - Help xd\n.join - just join to the voice channel\n.play - write .play {link to the youtube link} then you can listen audio from youtube\n.skip - just skip you dumbass\n.stop - Stoping the audio :moyai:\n.inv - shows your inventory\n.profile - shows your profile(updates coming soon)\n.ping - show the bot ping\n.show gay - hehehehe­`)
client.on('message', async message => {
    if (message.content === `${prefix}help`) {
        message.channel.send(helpembed)
    }
});

client.on('message', async message => {
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
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    User.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, res) => {
        if (err) return message.channel.send(`\`[❌DataBase]\` error to add database`)
        if (!res) {
            let user = new User({ guildID: message.guild.id, userID: message.author.id })
            console.log(`\`[✅DataBase]\` **${message.author.username}** succsesful added to database`)
            user.save().catch(err => message.channel.send(`\`[❌DataBase]\` i cant add yo to database. error: \`\`\`${err}\`\`\``));
        } else {
            let random = Math.floor(Math.random() * 3)
            res.cobblestone++
            res.money += random
            res.messages++
            res.diamonds += 0.003
            res.gold += 0.05
            res.iron += 0.1
            res.coal += 0.4

            res.save()

        }
    })
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

// После добавления комманд надо их выполнять при вводе сообщения, 
// так-как они сами выполнятся не начнут
client.on('message', async message => {
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
        await message.channel.send(`gay is ${message.guild.members.random()}`)
    }
});

client.login(token);