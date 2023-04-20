const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Import mysql connection
const mysql = require("mysql");
const { hostName, port, userName, password, databaseName } = require('../config.json');

function connectToDatabase() {
    var mysqlConnection = mysql.createConnection({
        host: hostName,
        port: port,
        user: userName,
        password: password,
        database: databaseName
    });

    return mysqlConnection;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {

		// Create the embed
		const embed = new EmbedBuilder()
			.setTitle('User Information')
			.setColor(0x22c2fc)
			.setDescription(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`)
			.setTimestamp()
			.setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

		// Connect to the database
		const mysqlConnection = connectToDatabase();

		// Check if the user exists in the database, if they do send over their user information as well
		mysqlConnection.query(`SELECT * FROM Users WHERE discordUserID = '${interaction.user.id}'`, async function (error, results) {
			if (error) {
				mysqlConnection.end();
				console.error(error);
				const errorEmbed = new EmbedBuilder()
					.setTitle('Error')
					.setColor(0xff0000)
					.setDescription('An error occurred while checking your permissions.');
				return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			}

			// If the user exists in the database, send over their user information with .addFields()
			// Users table schema: name, discordDisplayName, discordUserID, permissionID
			if (results.length > 0) {
				embed.addFields(
					{ name: 'Name', value: results[0].name, inline: true },
					{ name: 'Discord Display Name', value: results[0].discordDisplayName, inline: true },
					{ name: 'Discord User ID', value: results[0].discordUserID, inline: true },
					{ name: 'Permission Level', value: results[0].permissionID, inline: true }
				);
			}

			// Close the database connection
			mysqlConnection.end();
		});

		// Reply with the embed
		await interaction.reply({ embeds: [embed] });
	},
};