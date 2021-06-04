const { Pool } = require('pg');
require('dotenv').config();

const config = {
	user: process.env.DBUSER,
	host: process.env.DBHOST,
	database: process.env.DBDATABASE,
	password: process.env.DBPASSWORD,
	port: process.env.DBPORT,
	max: 10,
};

const pool = new Pool(config);

module.exports = pool;