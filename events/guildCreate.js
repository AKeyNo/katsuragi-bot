/**
 * File: guildCreate.js
 *
 * Summary: Sets up the table for the tcg when it enters a guild.
 *
 */

// const chalk = require('chalk');
const pool = require('../clientpool');
require('dotenv').config();

module.exports = (client, guild) => {
	setUpGuildTable(guild);
	const loginTime = new Date(Date.now());
	console.log(`TCG table has been created for ${guild.id} at ${loginTime}!`);
};

const setUpGuildTable = async (guild) => {
	pool.connect((err, client, done) => {
		client.query(`CREATE TABLE IF NOT EXISTS server${guild.id}( \
                CHARACTERID TEXT PRIMARY KEY NOT NULL, \
                DISCORDID TEXT)`);
		client.query(`CREATE TABLE IF NOT EXISTS serverUsers${guild.id}( \
					DISCORDID TEXT PRIMARY KEY NOT NULL, \
					LASTCLAIM TIMESTAMP DEFAULT '1970-01-01 00:00:00-00', \
					CLAIMSLEFT INT DEFAULT 0)`);
		client.query(`INSERT INTO server${guild.id}(CHARACTERID) \
                SELECT ID \
                FROM CHARACTERS`, (err) => {
			done(err);
		});
	});
};