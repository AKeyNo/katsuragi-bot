/**
 * File: ready.js
 *
 * Summary: Sets up the character database if it does not exist already.
 *
 */

const chalk = require('chalk');
const pool = require('../clientpool');
require('dotenv').config();

module.exports = client => {
	const loginTime = new Date(Date.now());
	setUpDatabase();
	console.log('\nLogged in as ' + chalk.yellowBright(`${client.user.tag}`) +
        `! (${client.user.id})\n` +
        chalk.yellowBright('Katsuragi') + ' arrived!\n' +
        'He arrived at ' + chalk.blue(`${loginTime.toString()}` + '.\n'));

	client.user.setActivity('!help for commands');
};

const setUpDatabase = async () => {
	pool.connect((err, client, done) => {
		client.query('CREATE TABLE IF NOT EXISTS CHARACTERS( \
                ID TEXT PRIMARY KEY NOT NULL, \
                NAME TEXT NOT NULL, \
                SERIES TEXT NOT NULL, \
                PICTURE TEXT NOT NULL)', (err) => {
			done(err);
		});
	});
};