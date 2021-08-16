require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { loadEvents, loadCommands, mongoConnect } = require('./functions');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
loadEvents(client);
loadCommands(client);
mongoConnect();
client.login(process.env.TOKEN);