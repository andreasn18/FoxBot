module.exports = {
    name: 'stop',
    description: "this is a stop command",
    execute(bot, ops, message, args){
        let fetched = ops.active.get(message.guild.id);

        if(!fetched) return message.channel.send('There isn\'t any music playing!');

        if(message.member.voice.channel != message.guild.me.voice.channel) return message.channel.send('Sorry, you currently aren\'t in the same channel as the bot!');

        ops.active.delete(fetched.guildID);
        fetched.connection.disconnect();

        message.channel.send(`Successfully stop!`);
    }
}