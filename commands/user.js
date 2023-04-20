const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Import mysql connection
const { connectToDatabase } = require('../functions/databaseConnection.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {

		// Connect to the database
		var mysqlConnection = connectToDatabase();
		mysqlConnection.connect();

		// Get the user's ID
		var userID = interaction.user.id;

		// Create the embed
		const embed = new EmbedBuilder()
			.setTitle('User Information')
			.setColor(0x22c2fc)
			.setDescription(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`)
			.setTimestamp()
			.setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

		// Get the user's data from the database
		var sql = `SELECT u.*, p.permissionLabel, p.permissionDescription FROM Users u INNER JOIN Permissions p ON p.permissionID = u.permissionID WHERE discordUserID = ${userID}`;
		mysqlConnection.query(sql, function (err, result) {
			if (err) {
				mysqlConnection.end();
				throw err;
			}

			// store the result in a variable
			var userData = result;

			if (userData.length > 0) {
				// Add the user's data to the embed.  table schema (userID, name, discordUserName, discordUserID, permissionID, permissionLabel, permissionDescription)
				embed.addFields({ name: 'User ID', value: userData.userID, inline: true });
				embed.addFields({ name: 'Name', value: userData.name, inline: true });
				embed.addFields({ name: 'Discord Username', value: userData.discordUserName, inline: true });
				embed.addFields({ name: 'Discord User ID', value: userData.discordUserID, inline: true });
				embed.addFields({ name: 'Permission Level', value: userData.permissionID, inline: true });
				embed.addFields({ name: 'Permission Label', value: userData.permissionLabel, inline: true });
				embed.addFields({ name: 'Permission Description', value: userData.permissionDescription, inline: true });
			}

			// Close the connection
			mysqlConnection.end();
		});


		// Reply with the embed
		await interaction.reply({ embeds: [embed] });
	},
};