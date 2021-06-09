/**
 * File: rolls.js
 *
 * Summary: Rolls for a random character that is either claimed or unclaimed.
 *
 */
const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const pool = require('../../clientpool');
require('dotenv').config();

const COLLECTIONTIME = 10000;

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
		const random = Math.random() * (1 - 0) + 0;
		const pgclient = await pool.connect();
		// console.log(random);

		// 10% chance to roll a claimed card
		// 90% chance to roll a non-claimed card
		if(random >= 0.1) {
			await getNewCharacter(message, handleEmbed, pgclient);
		}
		else {
			await getClaimedCharacter(message, pgclient);
		}
		pgclient.release();
	}
};

const getNewCharacter = async (message, callback, pgclient) => {
	// let pictureEmbed;
	try {
		const row = await pgclient.query(`SELECT * FROM CHARACTERS WHERE ID IN \
							(select CHARACTERID from server${message.guild.id} \
							WHERE DISCORDID IS NULL \
							ORDER BY RANDOM() \
							LIMIT 1)`);

		if(!row.rows[0]) {
			getClaimedCharacter(message, pgclient);
			return;
		}

		const fields = row.rows[0];
		const pictureEmbed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(fields.name.replace(/_/g, ' '))
			.setImage(fields.picture)
			.setFooter(fields.series);
		try {await callback(message, pgclient, row, pictureEmbed);}
		catch(e) {
			console.log(e);
		}
	}
	catch (e) {
		console.log(e);
	}
};

const getClaimedCharacter = async (message, pgclient) => {
	try {
		const row = await pgclient.query(`SELECT * FROM CHARACTERS WHERE ID IN \
							(select CHARACTERID from server${message.guild.id} \
							WHERE DISCORDID IS NOT NULL \
							ORDER BY RANDOM() \
							LIMIT 1)`);

		if(!row.rows[0]) {
			getNewCharacter(message, handleEmbed, pgclient);
			return;
		}

		const fields = row.rows[0];
		const pictureEmbed = new Discord.MessageEmbed()
			.setColor('ORANGE')
			.setTitle(fields.name.replace(/_/g, ' '))
			.setImage(fields.picture)
			.setFooter(fields.series);
		message.channel.send(pictureEmbed);
	}
	catch (e) {
		console.log(e);
	}
};

const assignCharacter = async (message, pgclient, character) => {
	await pgclient.query(`UPDATE server${message.guild.id} \
	SET DISCORDID = ${message.author.id}::text \
	WHERE characterid = ${character.id}::text`);
};

const handleEmbed = async (message, pgclient, character, pictureEmbed) => {
	// console.log(character);
	const fields = character.rows[0];

	const filter = (reaction, user) => {
		return reaction.emoji.name === '⭐' && user.id === message.author.id;
	};
	message.channel.send(pictureEmbed).then(sentEmbed => {
		// flag for the original user
		let authorFlag = false;

		sentEmbed.react('⭐');
		const collector = sentEmbed.createReactionCollector(filter, { time: COLLECTIONTIME });

		// check reactions for the author
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

			if (user.id == message.author.id) {
				authorFlag = true;

				try {
					collector.stop();
					console.log(`${message.author.tag} (${message.author.id}) received ${fields.name} in server${message.guild.id}!.`);
					try{
						assignCharacter(message, pgclient, fields);
					}
					catch(e) {
						console.log(e);
					}
					message.reply(`you claimed **${fields.name.replace(/_/g, ' ')}**!`);
				}
				catch (error) { console.error(error); }
			}
		});

		// end reaction collector if time runs out or the author doesn't claim the character
		collector.on('end', () => {
			// sentEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

			if (authorFlag) {
				console.log(`${message.author.id} reacted to this message.`);
			}
			else {
				try {
					// console.log(`${message.author.id} did not react to this message.`);
				}
				catch (error) { console.error(error); }
			}
		});
	});
};