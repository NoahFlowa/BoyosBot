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

		// Reply with the embed
		await interaction.reply({ embeds: [embed] });
	},
};