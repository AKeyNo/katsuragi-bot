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

module.exports = class RollsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rolls',
			aliases: ['r', 'roll'],
			group: 'tcg',
			memberName: 'rolls',
			description: 'Random rolls.',
			throttling: {
				usages: 1,
				duration: 10,
			},
			guildOnly: true,
		});
	}

	async run(message) {
		pool.connect((err, client, done) => {
			// generate a random number between 0 and 1 to see whether or not a claimed
			// character will be rolled or not
			const random = Math.random() * (1 - 0) + 0;
			console.log(random);

			// 10% chance to roll a claimed card
			// 90% chance to roll a non-claimed card
			if(random >= 0.1) {
				client.query('SELECT * FROM characters where ID in \
                        (select CHARACTERID from server462387144103821313 \
                        WHERE DISCORDID IS NULL \
                        ORDER BY RANDOM() \
                        LIMIT 1)', (err, res) => {
					const character = res.rows[0];

					const pictureEmbed = new Discord.MessageEmbed()
						.setColor('GREEN')
						.setTitle(character.name.replace(/_/g, ' '))
						.setImage(character.picture)
						.setFooter(character.series);

					message.channel.send(pictureEmbed);
					done(err);
				});
			}
			else {
				message.reply('claimed card');
			}
		});
	}
};