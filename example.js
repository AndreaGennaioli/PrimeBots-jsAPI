const Discord = require('discord.js');
const client = new Discord.Client();
client.login('TOKEN');

const PBapi = require('./index');
const PrimeBot = new PBapi('APIToken', client);

PrimeBot.on('ready', async () => {
	console.log('Sono connesso al server di PrimeBots!');
	console.log(await PrimeBot.getVotes());
});

PrimeBot.on('vote', (vote) => {
	console.log(vote.id + ' ha appena votato il bot!');
});

client.on('message', async (message) => {

	let haVotato = await PrimeBot.hasVoted(message.author.id);

	if(haVotato)
		message.reply('Hai votato il mio bot!');
	else
		message.reply('Non hai votato il mio bot!');
})