/**
 * File: hello.js
 *
 * Summary: Replies back with hello when the user says !hello.
 *
 */

const { Command } = require('discord.js-commando');

module.exports = class HelloCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hello',
			aliases: ['hi'],
			group: 'test',
			memberName: 'hello',
			description: 'Replies back saying hello',
			throttling: {
				usages: 1,
				duration: 10,
			},
			guildOnly: true,
		});
	}

	run(message) {
		return message.say('Hello!');
	}
};