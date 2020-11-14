// const {
//     Client,
//     attachment
// } = require("discord.js");

const Discord = require("discord.js");
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
const cheerio = require('cheerio');
const request = require('request');
const ownerID = '620973005266223104';
const fs = require('fs');
const active = new Map();
bot.commands = new Discord.Collection();

let ops = {
    ownerID: ownerID,
    active: active
}

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

var servers = {};

const token = 'NjIwOTczMDA1MjY2MjIzMTA0.XXekLQ.wZnnooagSPigAnuBzx9c4EhJxzo';
const PREFIX = '?';

bot.on('ready', () => {
    console.log('This bot is on!');
    bot.user.setActivity('Kekeyi', { type: 'LISTENING' }).catch(console.error);
});


bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).toLowerCase().trim().split(" ");
    //console.log(args);
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        switch (args[0]) {
            case 'ping':
                bot.commands.get('ping').execute(message, args);
                break;

            case 'search':
                args.splice(0,1);
                bot.commands.get('search').execute(bot, ops, message, args);
                break;

            case 'play':
                args[0] = args[1]
                bot.commands.get('play').execute(bot, ops, message, args);
                break;
            case 'queue':~
                bot.commands.get('queue').execute(bot, ops, message, args);
                break;

            case 'skip':
                bot.commands.get('skip').execute(bot, ops, message, args);
                break;

            case 'resume':
                bot.commands.get('resume').execute(bot, ops, message, args);
                break;

            case 'pause':
                bot.commands.get('pause').execute(bot, ops, message, args);
                break;

            case 'stop':
                bot.commands.get('stop').execute(bot, ops, message, args);
                break;
                // var server = servers[message.guild.id];
                // if (message.guild.voice.connection) {
                //     for (var i = server.queue.length - 1; i >= 0; i--) {
                //         server.queue.splice(i, 1);
                //     }
                //     server.dispatcher.disconnect();
                //     message.channel.send("Ending the queue. Leaving the voice channel");
                //     console.log('stopped the queue');
                // }
                // if (message.guild.connection) message.guild.voiceConnection.disconnect();
                // break;
            case 'image':
                image(message);
                break;
        }
    }
})

function image(message) {
    var options = {
        url: 'http://results.dogpile.com/serp?qc=images&q=' + "anime",
        method: 'GET',
        headers: {
            'Accept': 'text/html',
            'User-Agent': 'Chrome'
        }

    };
    request(options, function (error, response, responseBody) {
        if (error) {
            return;
        }
        lala = cheerio.load(responseBody);
        var links = lala('.image a.link');
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr('href'));
        console.log(urls);
        if (!urls.length) {
            return;
        }
        message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });
}
//bot.login(process.env.token);
bot.login(token);