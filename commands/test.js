const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

// Import mysql connection
const { connectToDatabase } = require('../functions/databaseConnection.js');

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
            console.log(users);

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle("Test")
                .setDescription("Test command");

            users.forEach(user => {
                embed.addFields({ name: 'Value', value: `${user.userID}`});
            });

            // Send embed
            interaction.reply({ embeds: [embed] });
        });
    },
};