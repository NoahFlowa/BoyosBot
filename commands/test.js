const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

// Import mysql connection
const mysql = require("mysql2")
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
        .setName('test')
        .setDescription('Test command'),
    async execute(interaction) {

        // Connect to database
        var mysqlConnection = connectToDatabase();
        mysqlConnection.connect();

        // Query database
        mysqlConnection.query("SELECT * FROM Users", function (err, result, fields) {
            if (err) {
                mysqlConnection.end();
                throw err;
            }

            const users = result;

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle("Test")
                .setDescription("Test command");

            users.ForEach(user => {
                embed.addFields({ name: 'Value', value: user.value});
            });

            // Send embed
            interaction.reply({ embeds: [embed] });
        });
    },
};