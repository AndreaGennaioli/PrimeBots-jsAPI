const fetch = require('node-fetch');
var io = require('socket.io-client');
const Discord = require('discord.js');

var _token;
var _client;
var socket;
var voteCallback;
var readyFunction;

function sleep(milliseconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

async function updateGuilds(client) {
	_client = client;
	fetch('https://test-primebots.tk/api/' + client.user.id + '/guilds/' + _token, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			botGuilds: client.guilds.cache.size
		})
	})
}

async function init(token, client) {
	do {
		await sleep(500);
	} while (client.user == null)
	var port = await fetch('https://test-primebots.tk/api/get/port/' + token + '/' + client.user.id).then(res => res.json());
	if (!port.port) return console.log(port);
	port = port.port;
	fetch('https://test-primebots.tk/api/' + client.user.id + '/guilds/' + token, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			botGuilds: client.guilds.cache.size
		})
	})
	socket = io('https://primebots-api-js.herokuapp.com');
	socket.on('connect', function () {

		socket.emit('createRoom', token);

		socket.on('ok', () => {
			if (readyFunction != null) {
				readyFunction();
			}
		})

		socket.on('newVote', vote => {
			voteCallback(vote);
		});
	});
	client.on('guildCreate', (g) => {
		updateGuilds(client);
	});
	client.on('guildDelete', (g) => {
		updateGuilds(client);
	});
}

module.exports = class PrimeBot {
	/**
	 * 
	 * @param {string} token Token API
	 * @param {Discord.Client} client your client object
	 */
	constructor(token, client) {
		_token = token;
		_client = client;
		init(token, client);
	};

	/** 
	 * @param {string} eventName
	 * @param {function} callback
	 * @example
	 * PrimeBot.on('vote', (vote) => {
	 *     console.log(vote.id + ' ha appena votato il bot!');
	 * });
	 */
	on(event, callback) {
		switch (event) {
			case 'ready':
				readyFunction = callback;
				break;
			case 'vote':
				voteCallback = callback;
				break;
		}
	};

	/**
	 * @param {string} userId
	 * @returns {boolean} Boolean Has voted or Not
	 * @example PrimeBot.hasVoted('465905397874688000')
	 * 
	 */
	async hasVoted(userId) {
		do {
			await sleep(500);
		} while (_client.user == null)
		let response = await fetch('https://test-primebots.tk/api/' + _client.user.id + '/vote/' + userId + '/' + _token).then((res) => res.json());
		console.log(response)
		if (response.hasVoted == true)
			return true;
		else
			return false
	};

	/**
	 * @returns {Promise<Array>} Array of strings for each user id that has voted your bot
	 * @example await PrimeBot.getVotes()
	 */
	async getVotes() {
		do {
			await sleep(500);
		} while (_client.user == null)
		return await fetch('https://test-primebots.tk/api/' + _client.user.id + '/votes/' + _token).then((res) => res.json()).then(response => response.votes);
	};
}