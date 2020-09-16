// const {
//     Client,
//     attachment
// } = require("discord.js");

const Discord = require("discord.js");
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
bot.commands = new Discord.Collection();

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
    bot.user.setActivity('FoxBot', { type: 'LISTENING' }).catch(console.error);
});


bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    console.log(args);
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        switch (args[0]) {
            case 'ping':
                bot.commands.get('ping').execute(message,args);
                break;

            case 'play':
                function play(connection, message) {
                    var server = servers[message.guild.id];

                    server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

                    server.queue.shift();
                    server.dispatcher.on("end", function () {
                        if (server.queue[0]) {
                            play(connection, message);
                        }
                        else {
                            connection.disconnect();
                        }
                    });
                }
                if (!args[1]) {
                    message.channel.send("You need to provide a link!");
                    return;
                }
                if (!message.member.voice.channel) {
                    message.channel.send("You must be a channel to play a bot!");
                    return;
                }
                if (!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                }

                var server = servers[message.guild.id];

                server.queue.push(args[1]);

                if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function (connection) {
                    play(connection, message);
                })
                break;

            case 'skip':
                var server = servers[message.guild.id];
                if (server.dispatcher) server.dispatcher.end();
                message.channel.send("Skipped the song");
                break;

            case 'stop':
                var server = servers[message.guild.id];
                if (message.guild.voiceConnection) {
                    for (var i = server.queue.length - 1; i >= 0; i--) {
                        server.queue.splice(i, 1);
                    }
                    server.dispatcher.end();
                    message.channel.send("Ending the queue. Leaving the voice channel");
                    console.log('stopped the queue');
                }
                if (message.guild.connection) message.guild.voiceConnection.disconnect();
                break;
            case 'image':
                image(message);
                break;
        }
    }
})

function image(message) {
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "dogs",
        method: "GET",
        header: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };

    request(options, function (error, response, responseBody) {
        if (error)
            return;

        $ = cheerio.load(responseBody);
        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        console.log(urls);
        if (!urls.length) {
            return;
        }

        message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });
}
bot.login(process.env.token);
//bot.login(token);