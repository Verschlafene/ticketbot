const fs = require('fs');
const mongoose = require('mongoose');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
module.exports.loadCommands = async (client) => {
    const commands = [];
    const commandCategories = fs.readdirSync('./commands/').filter(file => !file.includes('.'));
    for (const category of commandCategories) {
        const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${category}/${file}`);
            client.commands.set(file.split('.')[0], command);
            commands.push(command.data.toJSON());
        }
    }
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands('876552763042062407'),
                { body: commands },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
};
module.exports.loadEvents = async (client) => {
    const eventCategories = fs.readdirSync('./events').filter(file => !file.includes('.'));
    for (const category of eventCategories) {
        const eventFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`./events/${category}/${file}`);
            client.on(file.split('.')[0], event.bind(null, client));
        }
    }
};
module.exports.mongoConnect = async () => {
    mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
        console.log('MONGODB: Connected to MongoDB!');
    });
    mongoose.connection.on('err', error => {
        console.log('MONGODB: An error occured!\n' + error.stack);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MONGODB: Connection Lost!');
    });
}