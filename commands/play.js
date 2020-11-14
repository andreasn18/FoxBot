const { getInfo } = require("ytdl-core");
const ytdl = require("ytdl-core");
module.exports = {
    name: 'play',
    description: "this is a play command",
    async execute(bot, ops, message, args) {
        if (!message.member.voice.channel) return message.channel.send('Please connect to a voice channel');
        //if (message.guild.me.voice.channel) return message.channel.send('Sorry, the bot is already connected');
        console.log(args);
        let validate = await ytdl.validateURL(args[0]);

        if(!validate) return message.channel.send('Sorry, please input a **valid** url');

        let info = await ytdl.getInfo(args[0]);

        let data = ops.active.get(message.guild.id) || {};

        if (!data.connection) data.connection = await message.member.voice.channel.join();
        if (!data.queue) data.queue = [];
        data.guildID = message.guild.id;

        data.queue.push({
            songTitle: info.videoDetails.title,
            requester: message.author.tag,
            url: args[0],
            announceChannel: message.channel.id
        });

        if (!data.dispatcher) play(bot, ops, data);
        else{
            message.channel.send(`Added to queue: ${data.queue[0].songTitle} | Requested by: ${data.queue[0].requester}`);
        }

        ops.active.set(message.guild.id, data);
    }
}

async function play(client, ops, data){
    client.channels.cache.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested by: ${data.queue[0].requester}`);

    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, {filter: "audioonly"}));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.on('finish', function(){
        finish(client,ops, data);
    });
}

async function finish(client, ops, dispatcher){
    let fetched = ops.active.get(dispatcher.guildID);
    fetched.queue.shift();

    if(fetched.queue.length > 0){
        ops.active.set(dispatcher.guildID, fetched);
        play(client,ops, fetched);
    }
    else{
        ops.active.delete(dispatcher.guildID);

        let vc = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
        if (vc) vc.leave();
    }
}