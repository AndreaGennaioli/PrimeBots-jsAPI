const Discord = require('discord.js');
const client = new Discord.Client();
client.login('NzIzODc3MDk0OTIwMjkwMzA1.Xu4BFA.sKImVHxZ8js9b92ywL7S5As4PVQ');

const PBapi = require('./index');
const PrimeBot = new PBapi('APIToken.9hr85x7idrb.b6qtx7g1lj4', client);

PrimeBot.on('ready', async () => {
	console.log('Sono connesso al server di PrimeBots!');
	console.log(await PrimeBot.getVotes());
});

PrimeBot.on('vote', (vote) => {
	console.log(vote.id + ' ha appena votato il bot!');
});

client.on('message', (message) => {
	if(message.content == '!vote') {
		let haVotato = PrimeBot.hasVoted(message.author.id);
		if(haVotato)
			message.reply('Hai votato il mio bot!');
		else
			message.reply('Non hai votato il mio bot!');
	}
})