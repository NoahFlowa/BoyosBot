const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

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
        .setName('cowboyindian')
        .setDescription('Cowboy or Indian?')
        .addSubcommand(subcommand =>
            subcommand
                .setName('cowboy')
                .setDescription('Gives random amount of points to the Cowboys!')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('indian')
                .setDescription('Give random amount of points to the Indians!')
        ),             
    async execute(interaction) {
        // If the interaction is not a slash command, return
        if (!interaction.isCommand()) return;

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('Cowboy or Indian?')
            .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

        // If the slash command is /cowboyindian and subcommand is cowboy, execute this code
        if (interaction.commandName === 'cowboyindian' && interaction.options.getSubcommand() === 'cowboy') {
            // Connect to database
            var mysqlConnection = connectToDatabase();
            mysqlConnection.connect();

            // Get the current amount of points for the Cowboys
            var sql = "SELECT * FROM cowboyindian WHERE teamName = 'cowboys'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }
                var currentPoints = result[0].teamPoints;
                var newPoints = currentPoints + Math.floor(Math.random() * 10) + 1;

                // Check if the user who last got points is the same as the user who is executing the command
                var lastUser = result[0].teamLastUser;
                var currentUser = interaction.user.id;

                // If the user who last got points is the same as the user who is executing the command, return
                if (lastUser == currentUser) {
                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'You can\'t get points twice in a row!'});

                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed] });
                }

                // Check if the user who is executing the command has previously gotten points for the Indians
                var sql = "SELECT * FROM cowboyindian WHERE teamName = 'indians'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }
                    var lastUser = result[0].teamLastUser;
                    var currentUser = interaction.user.id;

                    // If the user who last got points is the same as the user who is executing the command, return
                    if (lastUser == currentUser) {
                        // add the error to an embed
                        embed.addFields({ name: 'Error', value: 'You can\'t get points for both teams!'});

                        // set the color to red
                        embed.setColor(0xff0000);

                        // send the embed
                        interaction.reply({ embeds: [embed] });
                    }
                });

                // Update the amount of points for the Cowboys, set the last user to the user who is executing the command
                var sql = "UPDATE cowboyindian SET teamPoints = " + newPoints + ", lastUser = '" + currentUser + "' WHERE teamName = 'cowboys'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }
                    console.log("Cowboys points updated to " + newPoints);
                    // add the new points to an embed
                    embed.addFields({ name: 'Cowboys', value: newPoints});
                    // set the color to Gold
                    embed.setColor(0xffd700);
                    // send the embed
                    interaction.reply({ embeds: [embed] });
                });
            });
        }

        // If the slash command is /cowboyindian and subcommand is indian, execute this code
        if (interaction.commandName === 'cowboyindian' && interaction.options.getSubcommand() === 'indian') {
            // Connect to database
            var mysqlConnection = connectToDatabase();
            mysqlConnection.connect();

            // Get the current amount of points for the Indians
            var sql = "SELECT * FROM cowboyindian WHERE teamName = 'indians'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }
                var currentPoints = result[0].teamPoints;
                var newPoints = currentPoints + Math.floor(Math.random() * 10) + 1;

                // Check if the user who last got points is the same as the user who is executing the command
                var lastUser = result[0].teamLastUser;
                var currentUser = interaction.user.id;

                // If the user who last got points is the same as the user who is executing the command, return
                if (lastUser == currentUser) {
                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'You can\'t get points twice in a row!'});

                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed] });
                }

                // Check if the user who is executing the command has previously gotten points for the Indians
                var sql = "SELECT * FROM cowboyindian WHERE teamName = 'cowboys'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }
                    var lastUser = result[0].teamLastUser;
                    var currentUser = interaction.user.id;

                    // If the user who last got points is the same as the user who is executing the command, return
                    if (lastUser == currentUser) {
                        // add the error to an embed
                        embed.addFields({ name: 'Error', value: 'You can\'t get points for both teams!'});

                        // set the color to red
                        embed.setColor(0xff0000);

                        // send the embed
                        interaction.reply({ embeds: [embed] });
                    }
                });

                // Update the amount of points for the Cowboys, set the last user to the user who is executing the command
                var sql = "UPDATE cowboyindian SET teamPoints = " + newPoints + ", lastUser = '" + currentUser + "' WHERE teamName = 'indians'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }
                    console.log("Cowboys points updated to " + newPoints);
                    // add the new points to an embed
                    embed.addFields({ name: 'Cowboys', value: newPoints});
                    // set the color to Gold
                    embed.setColor(0xffd700);
                    // send the embed
                    interaction.reply({ embeds: [embed] });
                });
            });
        }
    },
};