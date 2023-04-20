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
		.setName('gameserver')
		.setDescription('Options to list, add or remove game servers hosted by The Boyos')
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List all game servers ran by The Boyos')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a game server to the list of game servers ran by The Boyos')
				.addStringOption(option => option.setName('game').setDescription('Enter the name of the game for the server').setRequired(true))
				.addStringOption(option => option.setName('server').setDescription('Enter the name of the server').setRequired(true))
				.addStringOption(option => option.setName('ip').setDescription('Enter the IP address of the server').setRequired(true))
				.addStringOption(option => option.setName('port').setDescription('Enter the port of the server').setRequired(true))
				.addStringOption(option => option.setName('password').setDescription('Enter the password of the server').setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a game server from the list of game servers ran by The Boyos')
				.addStringOption(option => option.setName('server').setDescription('Enter the name of the server').setRequired(true))
		),
	async execute(interaction) {
		// If the interaction is not a slash command, return
		if (!interaction.isCommand()) return;

		// If the slash command is /gameserver and subcommand is list, execute this code
		if (interaction.commandName === 'gameserver' && interaction.options.getSubcommand() === 'list') {
			// connect to database
			mysqlConnection.connect();

			// get all game servers (schema: serverGame, serverName, serverIP, serverPort, serverPassword, userID)
			mysqlConnection.query('SELECT * FROM gameServers', function (error, results, fields) {                
                if (error) {
                    mysqlConnection.end();
                    throw error;
                }

				const gameServers = results;

				// create embed
				const embed = new EmbedBuilder()

				// add title
				.setTitle('Game Servers from The Boyos')

				// add description
				.setDescription('List of game servers ran by The Boyos')

                // add color
                .setColor(0x22c2fc)

                // add timestamp
                .setTimestamp()

                // add footer
                .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

				// add fields
				gameServers.forEach(gameServer => {
					embed.addFields({ name: gameServer.serverName, value: `Game: ${gameServer.serverGame}\nIP: ${gameServer.serverIP}\nPort: ${gameServer.serverPort}\nPassword: ${gameServer.serverPassword}\nAdded by: ${gameServer.userID}` });
				});

                // add extra spacing
                embed.addFields({ name: '\u200B', value: '\u200B' });

                // close database connection
                mysqlConnection.end();

				// send embed
				interaction.reply({ embeds: [embed] });
			});
		}

		// If the slash command is /server and subcommand is add, execute this code
		if (interaction.commandName === 'gameserver' && interaction.options.getSubcommand() === 'add') {
            // create master embed for all messages
            const embed = new EmbedBuilder()
                .setTitle('Game Servers | ADD')
                .setTimestamp()
                .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

			// connect to database
			mysqlConnection.connect();

			// get all game servers
			mysqlConnection.query('SELECT * FROM gameServers', function (error, results, fields) {
				if (error) {
                    mysqlConnection.end();
                    throw error;
                }
                
				const gameServers = results;

				// get options
				const game = interaction.options.getString('game');
				const serverName = interaction.options.getString('server');
				const ip = interaction.options.getString('ip');
				const port = interaction.options.getString('port');
				var password = interaction.options.getString('password');

				// if password is null, set it to 'none'
				if (password === null) {
					password = 'none';
				}

				// get user display name
                const userID = interaction.member.displayName;


				// check if server already exists
				const serverExists = gameServers.some(gameServer => gameServer.serverName === serverName);
				if (serverExists) {
                    // add embed fields for error message
                    embed.addFields({ name: 'Error', value: `The server ${serverName} already exists.` });
                    embed.addFields({ name: 'Action', value: 'Please use /server remove to remove the server, then use /server add to add the server again.' });

                    // set color to red
                    embed.setColor(0xFF0000);

                    // close database connection
                    mysqlConnection.end();

                    // send embed
                    return interaction.reply({ embeds: [embed] });
				}

				// Check to see if there are less than 10 servers in the database from the same user
				const userServers = gameServers.filter(gameServer => gameServer.userID === userID);
				if (userServers.length >= 10) {
                    // add embed fields for error message
                    embed.addFields({ name: 'Error', value: 'You have reached the maximum amount of servers you can add.' });
                    embed.addFields({ name: 'Action', value: 'Please use /server remove to remove a server, then use /server add to add the server again.' });

                    // set color to red
                    embed.setColor(0xFF0000);

                    // close database connection
                    mysqlConnection.end();

                    // send embed
                    return interaction.reply({ embeds: [embed] });
				}

				// insert request into database (schema: serverGame, serverName, serverIP, serverPort, serverPassword, userID)
				mysqlConnection.query(`INSERT INTO gameServers (serverGame, serverName, serverIP, serverPort, serverPassword, createdBy) VALUES ('${game}', '${serverName}', '${ip}', '${port}', '${password}', '${userID}')`, function (error, results, fields) {
                    if (error) throw error;

                    // add embed fields for success message
                    embed.addFields({ name:'Success', value: `The server ${serverName} has been added.` });
                    embed.addFields({ name:'Action', value: 'Use /server list to view all servers.' });

                    // set color to green
                    embed.setColor(0x00FF00);

                    // close database connection
                    mysqlConnection.end();

                    // send embed
                    interaction.reply({ embeds: [embed] });
				});
			});
		}

		// If the slash command is /server and subcommand is remove, execute this code
		if (interaction.commandName === 'gameserver' && interaction.options.getSubcommand() === 'remove') {
            // create master embed for all messages
            const embed = new EmbedBuilder()
                .setTitle('Game Servers | REMOVE')
                .setTimestamp()
                .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

			// connect to database
			mysqlConnection.connect();

			// get all game servers from the database matching the server name from the slash command option
			mysqlConnection.query(`SELECT * FROM gameServers WHERE serverName = '${interaction.options.getString('server')}'`, function (error, results, fields) {
				if (error) {
                    mysqlConnection.end();
                    throw error;
                }

				const gameServers = results;

				// get userID
				const userID = interaction.user.id;

				// check if server exists
				if (gameServers.length === 0) {
                    // add embed fields for error message
                    embed.addFields({ name: 'Error', value: `The server ${interaction.options.getString('server')} does not exist.` });
                    embed.addFields({ name: 'Action', value: 'Please use /server add to add the server or /list to view all servers.' });

                    // set color to red
                    embed.setColor(0xFF0000);

                    // send embed
                    return interaction.reply({ embeds: [embed] });
				}

				// check if user is the one who added the server or is noahs userID (noahs userID is 215624149597421568)
				if (gameServers[0].userID !== userID && userID !== '215624149597421568') {
                    // add embed fields for error message
                    embed.addFields({ name:'Error', value: `You are not the one who added the server ${interaction.options.getString('server')}.` });
                    embed.addFields({ name:'Action', value: 'Please use /server add to add the server or /list to view all servers.' });

                    // set color to red
                    embed.setColor(0xFF0000);

                    // send embed
                    return interaction.reply({ embeds: [embed] });
				}

				// delete server from database
				mysqlConnection.query(`DELETE FROM gameServers WHERE serverName = '${interaction.options.getString('server')}'`, function (error, results, fields) {
					if (error) {
                        mysqlConnection.end();
                        throw error;
                    }

                    // add embed fields for success message
                    embed.addFields({ name:'Success', value: `The server ${interaction.options.getString('server')} has been removed.` });
                    embed.addFields({ name:'Action', value: 'Use /server list to view all servers.' });

                    // set color to green
                    embed.setColor(0x00FF00);

                    // close database connection
                    mysqlConnection.end();

                    // send embed
                    return interaction.reply({ embeds: [embed] });
				});
			});
		}
	},
};