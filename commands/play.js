module.exports = {
    name: 'play',
    description: "this is a play command",
    execute(message, args){
        var servers = {};
        function play(connection, message) {
            const ytdl = require("ytdl-core");
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
    }
}