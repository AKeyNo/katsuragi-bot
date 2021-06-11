/**
 * File: information.js
 *
 * Summary: Shows information about a certain character.
 *
 */
const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const pool = require('../../clientpool');
require('dotenv').config();

module.exports = class InformationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'information',
			aliases: ['i', 'info'],
			group: 'tcg',
			memberName: 'information',
			description: 'Shows information about a certain character.',
			throttling: {
				usages: 1,
				duration: 10,
			},
			guildOnly: true,
			args: [{
				key: 'characterName',
				prompt: 'What character would you like to look up?',
				type: 'string',
				infinite: true,
			}],
		});
	}

	async run(message, { characterName }) {
		let name = '';
		characterName.forEach((element, index) => {
			name = name + element;
			if(index < characterName.length - 1) {
				name += ' ';
			}
		});
		// console.log(name);

		const pgclient = await pool.connect();
		try {
			const row = await pgclient.query(`SELECT characters.name, characters.series, characters.picture, server${message.guild.id}.discordid
											FROM characters 
											INNER JOIN server${message.guild.id} ON characters.id=server${message.guild.id}.characterid
											WHERE name = '${name}'::text`);
			// console.log(row);

			const fields = row.rows[0];
			const pictureEmbed = new Discord.MessageEmbed()
				.setColor('BLACK')
				.setTitle(fields.name)
				.setImage(fields.picture)
				.setDescription(fields.series);

			if(fields.discordid) {
				const user = await this.client.users.fetch(fields.discordid);
				pictureEmbed.setFooter(user.tag, user.displayAvatarURL());
			}
			message.channel.send(pictureEmbed);
		}
		catch (e) {
			// if invalid user, send a unique response back to the user
			if(e instanceof TypeError) {
				message.channel.send(`**${characterName}** does not exist!`);
			}
			else {
				console.log(e);
			}
		}
		finally {pgclient.release();}
	}
};
