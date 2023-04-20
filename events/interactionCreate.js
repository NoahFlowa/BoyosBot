// Import mysql connection
const mysql = require("mysql");
const { hostName, port, userName, password, databaseName } = require('../config.json');

var mysqlConnection = mysql.createConnection({
    host: hostName,
    port: port,
    user: userName,
    password: password,
    database: databaseName
});

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);

			// Get userID
			const userID = interaction.user.id;

			// Get command name
			const commandName = interaction.commandName;

			// Get file name which is in the commands directory and the file name is the same as the command name
			const fileName = `commands/${commandName}.js`;

			// Get the cleansed error message
			const cleansedErrorMessage = error.message.replace(/'/g, "''");

			// connect to database
			mysqlConnection.connect();

			// insert error into database.  schema is: errorMessage, errorLocation, encounteredBy
			mysqlConnection.query(`INSERT INTO botErrorLogs (errorMessage, errorLocation, encounteredBy) VALUES ('${cleansedErrorMessage}', '${fileName}', '${userID}')`, function (error, results, fields) {
				if (error) throw error;
			});

			// disconnect from database
			mysqlConnection.end();

			// reply to the user that the command failed and the error has been logged
			return interaction.reply({ content: 'There was an error while executing this command.  The error has been logged.', ephemeral: true });
		}
	},
};
