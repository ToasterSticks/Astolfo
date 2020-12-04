'use strict';

const Discord = require('discord.js'),
	map = require('enmap'),
	auth = require('./auth/auth.json'),
	{ con, ev, net } = require('./config/language.json'),
	config = require('./config/config.json'),
	fs = require('fs'),
	client = new Discord.Client();
// EVENTS =================================================
fs.readdir('./events/', (err, events) => {
	if (err) return console.error(err);
	events.forEach(eventFile => {
		const event = require(`./events/${eventFile}`),
			clientEvent = eventFile.split('.')[0];
		if (clientEvent.startsWith(config.disablePrefix)) return;
		try {
			client.on(clientEvent, event.bind(null, client));
			setTimeout(() => { console.log(`${con.OK}Loaded event ${clientEvent.toUpperCase()}!`); }, 1000);
		} catch { return setTimeout(() => { console.log(`${con.ERR}Failed to load event ${clientEvent.toUpperCase()}!`); }, 1000); }
	});
});
// COMMANDS ===============================================
const groupN = [
	'fun',
	'moderation',
	'guild',
	'nsfw',
	'other',
	'admin',
	'info',
];
client.commandMap = new map();
groupN.forEach(group => {
	fs.readdir(`./commands/${group}`, (err, cmds) => {
		if (err) {
			console.log(`${con.ERR}Failed to load module ${group.toUpperCase()}: ${err.toString().substr(15)}`);
			return process.exit();
		}
		cmds.forEach(file => {
			if (!file.endsWith('.js') || file.startsWith(config.disablePrefix)) return;
			const source = require(`./commands/${group}/${file}`),
				command = file.split('.')[0];
			try {
				client.commandMap.set(command, source);
				setTimeout(() => { console.log(`${con.OK}Loaded command ${group.toUpperCase()}:${command.toUpperCase()}!`); }, 3000);
			} catch { return setTimeout(() => { console.log(`${con.ERR}failed to load command ${command.toUpperCase()}`); }, 3000); }

		});
	});
});
// CONSOLE ===============================================
setTimeout(() => { console.log(`${con.INFO}Finishing...`); }, 3500);
process.on('SIGINT', () => {
	console.log(`${con.LINE}${con.STOP}${ev.stopping}`);
	client.destroy();
	setTimeout(() => { console.log(`${con.OK}${net.disconnected}`); }, 700);
	setTimeout(() => { process.exit(0); }, 701);
}).on('exit', () => {
	console.log(`${con.OK}${ev.stopped}`);
});

client.login(auth.discord.token);