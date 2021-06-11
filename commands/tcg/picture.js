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
			aliases: ['p', 'random'],
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
		const pgclient = await pool.connect();

		try {
			const row = await pgclient.query(`SELECT characters.name, characters.series, characters.picture, server${message.guild.id}.discordID
					FROM characters
					INNER JOIN server${message.guild.id} ON characters.ID=server${message.guild.id}.characterID
					ORDER BY RANDOM()
					LIMIT 1`);
			const fields = row.rows[0];

			const pictureEmbed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle(fields.name)
				.setImage(fields.picture)
				.setFooter(fields.series);

			if(fields.discordid) {
				const user = await message.client.users.fetch(fields.discordid);
				pictureEmbed.setFooter(user.tag, user.displayAvatarURL());
			}
			message.channel.send(pictureEmbed);
		}
		catch(e) {
			console.log(e);
		}
		finally {
			pgclient.release();
		}
	}
};