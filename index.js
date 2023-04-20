// * Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// * Require ENV variables
const mysql = require("mysql");
const { hostName, port, userName, password, databaseName, discordToken } = require('./config.json');

// * Require the deployCommands function
const { deployCommands } = require('./deploy-commands.js');

// * Create client options to be passed to the client constructor
const clientOptions = { restRequestTimeout: 60000 }; // 60 seconds

// * Create mysql connection
var mysqlConnection = mysql.createConnection({
    host: hostName,
    port: port,
    user: userName,
    password: password,
    database: databaseName
});

// * Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] }, clientOptions);


client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        // Wrap command execution code in a try-catch block
        client.commands.set(command.data.name, async (...args) => {
            try {
                await command.execute(...args);
            } catch (error) {
                console.error(`Error executing command ${command.data.name}:`, error);
                try {
                    // Add the error to the botErrorLogs table in the database
                    mysqlConnection.connect();

                    const userID = args[0].user.id;
                    const cleansedError = error.toString().replace(/'/g, "''");

                    // botErrorLogs table schema: (errorMessage, errorLocation, encounteredBy)
                    mysqlConnection.query(`INSERT INTO botErrorLogs (errorMessage, errorLocation, encounteredBy) VALUES ('${cleansedError}', '${filePath}', '${userID}')`, function (error, results, fields) {
                        if (error) throw error;
                    });

                    // close the connection to the database
                    mysqlConnection.end();

                    // Send an error message to the user
                    await args[0].reply(`There was an error while executing that command. The error has been logged and will be reviewed by the bot developer.`);
                } catch (error) {
                    console.error(`Error sending error message to user:`, error);
                }
            }
        });
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// * Log in to Discord with your client's token
client.login(discordToken).then(async () => {
    // * Deploy commands after the bot has logged in
    await deployCommands();
});