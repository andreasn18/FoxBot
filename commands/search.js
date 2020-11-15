const search = require('yt-search');
module.exports = {
    name: 'search',
    description: "this is a search command",
    execute(bot, ops, message, args) {
        search(args.join(' '), function (err, res) {
            if (err) return message.channel.send('Sorry, something went wrong');

            let videos = res.videos.slice(0, 10);

            let resp = '';
            for (var i in videos) {
                resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
            }

            resp += `\n**Choose a number beetwen \`1-${videos.length}\``;

            message.channel.send(resp);

            const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0 || m.content.includes(',');

            const collector = message.channel.createMessageCollector(filter);

            collector.videos = videos
            collector.once('collect', async function (m) {
                let commandFile = require(`./play.js`);
                //console.log([this.videos[parseInt(m.content)-1].url]);
                //console.log(m);
                for (var i=0; i< m.content.split(",").length; i++) {
                    console.log(i);
                    await commandFile.execute(bot, ops, message, [this.videos[parseInt(i)].url]);
                }
            });
        });
    }
}