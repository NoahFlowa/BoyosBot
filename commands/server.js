const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides basic information about The Boyos Server.  Can also list game servers or add game servers.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List all game servers ran by The Boyos')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a game server to the list of game servers ran by The Boyos')
				.addStringOption(option => option.setName('Game').setDescription('Enter the name of the game for the server').setRequired(true))
				.addStringOption(option => option.setName('Server').setDescription('Enter the name of the server').setRequired(true))
				.addStringOption(option => option.setName('IP').setDescription('Enter the IP address of the server').setRequired(true))
				.addStringOption(option => option.setName('Port').setDescription('Enter the port of the server').setRequired(true))
				.addStringOption(option => option.setName('Password').setDescription('Enter the password of the server').setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a game server from the list of game servers ran by The Boyos')
				.addStringOption(option => option.setName('Server').setDescription('Enter the name of the server').setRequired(true))
		),
	async execute(interaction) {
		// If the interaction is not a slash command, return
		if (!interaction.isCommand()) return;

		// If the slash command is /server list the basic information about the server
		if (interaction.commandName === 'server') {
			// interaction.guild is the object representing the Guild in which the command was run
			await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
		}

		// If the slash command is /server and subcommand is list, execute this code
		if (interaction.commandName === 'server' && interaction.options.getSubcommand() === 'list') {
			// connect to database
			mysqlConnection.connect();

			// get all game servers (schema: serverGame, serverName, serverIP, serverPort, serverPassword, userID)
			mysqlConnection.query('SELECT * FROM gameServers', function (error, results, fields) {
				if (error) throw error;
				const gameServers = results;

				// create embed
				const embed = new EmbedBuilder()

				// add title
				.setTitle('Game Servers')

				// add description
				.setDescription('List of game servers ran by The Boyos')

				// add fields
				gameServers.forEach(gameServer => {
					embed.addField(gameServer.serverName, `Game: ${gameServer.serverGame}\nIP: ${gameServer.serverIP}\nPort: ${gameServer.serverPort}\nPassword: ${gameServer.serverPassword}\nAdded by: <@${gameServer.userID}>`);
				});

				// send embed
				interaction.reply({ embeds: [embed] });
			});

			// close database connection
			mysqlConnection.end();
		}

		// If the slash command is /server and subcommand is add, execute this code
		if (interaction.commandName === 'server' && interaction.options.getSubcommand() === 'add') {
			// connect to database
			mysqlConnection.connect();

			// get all game servers
			mysqlConnection.query('SELECT * FROM gameServers', function (error, results, fields) {
				if (error) throw error;
				const gameServers = results;

				// get options
				const game = interaction.options.getString('game');
				const serverName = interaction.options.getString('server');
				const ip = interaction.options.getString('ip');
				const port = interaction.options.getString('port');
				const password = interaction.options.getString('password');

				// get userID
				const userID = interaction.user.id;

				// check if server already exists
				const serverExists = gameServers.some(gameServer => gameServer.serverName === serverName);
				if (serverExists) {
					return interaction.reply(`The server ${serverName} already exists.`);
				}

				// Check to see if there are less than 10 servers in the database from the same user
				const userServers = gameServers.filter(gameServer => gameServer.userID === userID);
				if (userServers.length >= 10) {
					return interaction.reply(`You have reached the limit of 10 servers.  Use /server remove to remove a server.`);
				}

				// insert request into database (schema: serverGame, serverName, serverIP, serverPort, serverPassword, userID)
				mysqlConnection.query(`INSERT INTO gameServers (serverGame, serverName, serverIP, serverPort, serverPassword, userID) VALUES ('${game}', '${serverName}', '${ip}', '${port}', '${password}', '${userID}')`, function (error, results, fields) {
					if (error) throw error;
					interaction.reply(`The server ${serverName} has been added.`);
				});
			});

			// close database connection
			mysqlConnection.end();
		}

		// If the slash command is /server and subcommand is remove, execute this code
		if (interaction.commandName === 'server' && interaction.options.getSubcommand() === 'remove') {
			// connect to database
			mysqlConnection.connect();

			// get all game servers from the database matching the server name from the slash command option
			mysqlConnection.query(`SELECT * FROM gameServers WHERE serverName = '${interaction.options.getString('server')}'`, function (error, results, fields) {
				if (error) throw error;
				const gameServers = results;

				// get userID
				const userID = interaction.user.id;

				// check if server exists
				if (gameServers.length === 0) {
					return interaction.reply(`The server ${interaction.options.getString('server')} does not exist.`);
				}

				// check if user is the one who added the server or is noahs userID (noahs userID is 215624149597421568)
				if (gameServers[0].userID !== userID && userID !== '215624149597421568') {
					return interaction.reply(`You are not the one who added the server ${interaction.options.getString('server')}.`);
				}

				// delete server from database
				mysqlConnection.query(`DELETE FROM gameServers WHERE serverName = '${interaction.options.getString('server')}'`, function (error, results, fields) {
					if (error) throw error;
					interaction.reply(`The server ${interaction.options.getString('server')} has been removed.`);
				});
			});
		}
	},
};