module.exports = {
    name: 'skip',
    description: "this is a skip command",
    execute(bot, ops, message, args){
        let fetched = ops.active.get(message.guild.id);

        if (!fetched) return message.channel.send('There isn\'t any music is playing');

        if(message.member.voiceChannel != message.guild.member.channel) return message.channel.send('Sorry, you currently aren\'t in the same channel as the bot!');

        message.channel.send('Successfully skipped song!');
        return fetched.dispatcher.emit('finish');
    }
}