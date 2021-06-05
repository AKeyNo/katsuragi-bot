/**
 * File: setUpGuild.js
 *
 * Summary: Sets up tables for guilds.
 *
 */

const { Command } = require('discord.js-commando');
const pool = require('../../clientpool');
require('dotenv').config();

module.exports = class SetUpGuildCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setupguild',
			aliases: ['testg'],
			group: 'test',
			memberName: 'setupguild',
			description: 'Resetting guild tables.',
			throttling: {
				usages: 1,
				duration: 10,
			},
			guildOnly: true,
		});
	}

	run(message) {
		pool.connect((err, client, done) => {
			client.query(`DROP TABLE IF EXISTS server${message.guild.id}`);
			client.query(`DROP TABLE IF EXISTS serverUsers${message.guild.id}`);
			client.query(`CREATE TABLE IF NOT EXISTS server${message.guild.id}( \
                CHARACTERID TEXT PRIMARY KEY NOT NULL, \
                DISCORDID TEXT)`);
			client.query(`CREATE TABLE IF NOT EXISTS serverUsers${message.guild.id}( \
					DISCORDID TEXT PRIMARY KEY NOT NULL, \
					LASTCLAIM TIMESTAMP DEFAULT '1970-01-01 00:00:00-00', \
					CLAIMSLEFT INT DEFAULT 0)`);
			client.query(`INSERT INTO server${message.guild.id}(CHARACTERID) \
                SELECT ID \
                FROM CHARACTERS`, (err) => {
				done(err);
			});
		});
	}
};