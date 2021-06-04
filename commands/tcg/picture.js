/**
 * File: picture.js
 *
 * Summary: Replies back with a random picture to the user.
 *
 */
const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const pool = require('../../clientpool');
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
		pool.connect((err, client, done) => {
			client.query('SELECT * \
					FROM CHARACTERS \
					ORDER BY random() \
					LIMIT 1', (err, res) => {
				const character = res.rows[0];

				const pictureEmbed = new Discord.MessageEmbed()
					.setColor('GREEN')
					.setTitle(character.name.replace(/_/g, ' '))
					.setImage(character.picture)
					.setFooter(character.series);

				message.channel.send(pictureEmbed);
				done(err);
			});
		});
	}
};