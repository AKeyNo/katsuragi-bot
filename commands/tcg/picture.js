/**
 * File: picture.js
 *
 * Summary: Replies back with hello when the user says !hello.
 *
 */

const { Command } = require('discord.js-commando');
// const pool = require('../../clientpool');

require('dotenv').config();

module.exports = class PictureCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'picture',
			aliases: ['p'],
			group: 'test',
			memberName: 'picture',
			description: 'Random Picture',
			throttling: {
				usages: 1,
				duration: 10,
			},
			guildOnly: true,
		});
	}

	async run(message) {
		/* pool.connect((err, client, done) => {
			console.log('yo');
			const pictreQuery = client.query('select')
		} */
	}
};