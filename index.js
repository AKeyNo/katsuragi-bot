const Commando = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// https://discord.com/oauth2/authorize?client_id=849198716069478400&scope=bot&permissions=2215102529
const client = new Commando.Client({
	commandPrefix: process.env.PREFIX,
	owner: '189985219451944960',
	disableEveryone: true,
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['tcg', 'TCG'],
		['test', 'Test'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		// help: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

client.on('error', console.error);
client.login(process.env.TOKEN);