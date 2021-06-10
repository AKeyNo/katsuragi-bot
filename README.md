# katsuragi-bot
Discord trading card game bot.

## Requirements
- Node.js 12.0.0 or higher - https://nodejs.org/en/download/

## Recommended Downloads
- Visual Studio Code - https://code.visualstudio.com/
- PostgreSQL - https://www.postgresql.org/

## Installation
0. Clone the repository.
1. [Create a Discord bot](https://discordapp.com/developers/applications/me) and grab a token for your bot. Treat it like a password for the bot and keep it a secret.
2. Open `.env.example` and paste your bot token. Change the file name to `.env`.
3. Head to the main directory in a command prompt. Enter `npm install`. This will install all the required node modules.
4. To run the bot, head to the main directory in a command prompt and type `node index.js`.

## Adding characters
1. Manually add it to the PostgreSQL database table called characters. Need the character's name, the series, and a link to the picture of the character.

## To-do
- Better way to add characters
- Showing off collection for each user and allow for trading
