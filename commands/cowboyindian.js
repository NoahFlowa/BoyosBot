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

        // If the slash command is /cowboyindian and subcommand is cowboy, execute this code
        if (interaction.commandName === 'cowboyindian' && interaction.options.getSubcommand() === 'cowboy') {
            // Connect to database
            var mysqlConnection = connectToDatabase();
            mysqlConnection.connect();
            
            // Check the activeCommands table and see if this command is active to run
            var sql = "SELECT * FROM activeCommands WHERE commandName = 'cowboyindian'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }

                // store the results in a variable
                var commandData = result;
                console.log(commandData);

                // If the command is not active 0, return
                if (commandData.active == 0) {
                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'This command is not active!  This command will active in November!'});
                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }

            });

            // Get the current amount of points for the Cowboys
            var sql = "SELECT * FROM cowboyindian WHERE teamName = 'cowboys'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }

                // store the results in a variable
                var teamData = result;
                console.log(teamData);

                // set teamPoints to 0 if it is null or NaN, parseInt to make sure it is a number
                if (isNaN(parseInt(teamData.teamPoints)) || teamData.teamPoints == null) {
                    teamData.teamPoints = 0;
                }

                // Create embed
                const embed = new EmbedBuilder()
                .setTitle('Cowboy or Indian?')
                .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                // Get the current amount of points for the Cowboys
                var currentPoints = parseInt(teamData.teamPoints);
                var newPoints = currentPoints + Math.floor(Math.random() * 10) + 1;

                // Check if the user who last got points is the same as the user who is executing the command
                var lastUser = teamData.teamLastUser;
                var currentUser = interaction.user.id;

                // If the user who last got points is the same as the user who is executing the command, return
                if (lastUser == currentUser) {
                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'You can\'t get points twice in a row!'});

                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }

                // Check if the user who is executing the command has previously gotten points for the Indians
                var sql = "SELECT * FROM cowboyindian WHERE teamName = 'indians'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }

                    // store the results in a variable
                    var teamData = result;
                    console.log(teamData);

                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // Get the current amount of points for the Cowboys
                    var lastUser = teamData.teamLastUser;
                    var currentUser = interaction.user.id;

                    // If the user who last got points is the same as the user who is executing the command, return
                    if (lastUser == currentUser) {
                        // add the error to an embed
                        embed.addFields({ name: 'Error', value: 'You can\'t get points for both teams!'});

                        // set the color to red
                        embed.setColor(0xff0000);

                        // send the embed
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                });

                // Update the amount of points for the Cowboys, set the last user to the user who is executing the command
                var sql = "UPDATE cowboyindian SET teamPoints = " + parseInt(newPoints) + ", teamLastUser = '" + currentUser + "' WHERE teamName = 'cowboys'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }

                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // Log the new amount of points for the Cowboys
                    console.log("Cowboys points updated to " + newPoints);
                    // add the new points to an embed
                    embed.addFields({ name: 'Cowboys', value: `${newPoints}`});
                    // set the color to Gold
                    embed.setColor(0xffd700);

                    // close the connection
                    mysqlConnection.end();
                    
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

            // Check the activeCommands table and see if this command is active to run
            var sql = "SELECT * FROM activeCommands WHERE commandName = 'cowboyindian'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }

                // store the results in a variable
                var commandData = result;
                console.log(commandData);

                // If the command is not active 0, return
                if (commandData.active == 0) {
                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'This command is not active!  This command will active in November!'});
                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }

            });

            // Get the current amount of points for the Indians
            var sql = "SELECT * FROM cowboyindian WHERE teamName = 'indians'";
            mysqlConnection.query(sql, function (err, result) {
                if (err) {
                    mysqlConnection.end();
                    throw err;
                }

                // store the results in a variable
                var teamData = result;
                console.log(teamData);

                // set teamPoints to 0 if it is null or NaN, parseInt to make sure it is a number
                if (isNaN(parseInt(teamData.teamPoints)) || teamData.teamPoints == null) {
                    teamData.teamPoints = 0;
                }

                // Create embed
                const embed = new EmbedBuilder()
                .setTitle('Cowboy or Indian?')
                .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                // Get the current amount of points for the Indians
                var currentPoints = parseInt(teamData.teamPoints);
                var newPoints = currentPoints + Math.floor(Math.random() * 10) + 1;

                // Check if the user who last got points is the same as the user who is executing the command
                var lastUser = teamData.teamLastUser;
                var currentUser = interaction.user.id;

                // If the user who last got points is the same as the user who is executing the command, return
                if (lastUser == currentUser) {
                    // add the error to an embed
                    embed.addFields({ name: 'Error', value: 'You can\'t get points twice in a row!'});

                    // set the color to red
                    embed.setColor(0xff0000);

                    // send the embed
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }

                // Check if the user who is executing the command has previously gotten points for the Indians
                var sql = "SELECT * FROM cowboyindian WHERE teamName = 'cowboys'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }

                    // store the results in a variable
                    var teamData = result;
                    console.log(teamData);

                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // Get the current amount of points for the Cowboys
                    var lastUser = teamData.teamLastUser;
                    var currentUser = interaction.user.id;

                    // If the user who last got points is the same as the user who is executing the command, return
                    if (lastUser == currentUser) {
                        // add the error to an embed
                        embed.addFields({ name: 'Error', value: 'You can\'t get points for both teams!'});

                        // set the color to red
                        embed.setColor(0xff0000);

                        // send the embed
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                });

                // Update the amount of points for the Cowboys, set the last user to the user who is executing the command
                var sql = "UPDATE cowboyindian SET teamPoints = " + parseInt(newPoints) + ", teamLastUser = '" + currentUser + "' WHERE teamName = 'indians'";
                mysqlConnection.query(sql, function (err, result) {
                    if (err) {
                        mysqlConnection.end();
                        throw err;
                    }

                    // Create embed
                    const embed = new EmbedBuilder()
                    .setTitle('Cowboy or Indian?')
                    .setDescription('Show your team spirit by getting points for your team!  Add the cowboy or indian option to the command to get points for your team!');

                    // Log the new amount of points for the Cowboys
                    console.log("Indians points updated to " + newPoints);
                    // add the new points to an embed
                    embed.addFields({ name: 'Indians', value: `${newPoints}`});
                    // set the color to Brown
                    embed.setColor(0x8b4513);

                    // close the connection
                    mysqlConnection.end();

                    // send the embed
                    interaction.reply({ embeds: [embed] });
                });

                
            });
        }
    },
};