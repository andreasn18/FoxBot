module.exports = {
    name: 'pause',
    description: "this is a pause command",
    execute(bot, ops, message, args){
        let fetched = ops.active.get(message.guild.id);

        if(!fetched) return message.channel.send('There isn\'t any music playing!');

        if(message.member.voiceChannel != message.guild.member.channel) return message.channel.send('Sorry, you currently aren\'t in the same channel as the bot!');

        if(fetched.dispatcher.paused) return message.channel.send('This music is already paused');

        fetched.dispatcher.pause();

        message.channel.send(`Successfully paused ${fetched.queue[0].songTitle}`);
    }
}