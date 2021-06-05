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
		// console.log(random);

		// 10% chance to roll a claimed card
		// 90% chance to roll a non-claimed card
		if(random >= 0.1) {
			getNewCharacter(message, handleEmbed);
		}
		else {
			message.reply('insert dupe code here');
		}
	}
};

const getNewCharacter = async (message, callback) => {
	const client = await pool.connect();
	// let pictureEmbed;
	try {
		const row = await client.query('SELECT * FROM characters where ID in \
							(select CHARACTERID from server462387144103821313 \
							WHERE DISCORDID IS NULL \
							ORDER BY RANDOM() \
							LIMIT 1)');
		try {await callback(message, client, row);}
		catch(e) {
			console.log(e);
		}
	}
	finally {
		client.release();
	}
};

const handleEmbed = (message, client, character) => {
	// console.log(character);
	const fields = character.rows[0];
	const pictureEmbed = new Discord.MessageEmbed()
		.setColor('GREEN')
		.setTitle(fields.name.replace(/_/g, ' '))
		.setImage(fields.picture)
		.setFooter(fields.series);

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
				}
				catch (error) { console.error(error); }
			}
		});

		// end reaction collector if time runs out or the author catches the fish
		collector.on('end', () => {
			// sentEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

			if (authorFlag) {
				console.log(`${message.author.id} reacted to this message.`);
			}
			else {
				// updates embed to escapedEmbed if the fish runs away
				try { console.log(`${message.author.id} did not react to this message.`); }
				catch (error) { console.error(error); }
			}
		});
	});
};