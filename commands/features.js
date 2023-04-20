// Require the necessary discord.js classes
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
        .setName('feature')
        .setDescription('Request a new feature for the bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('request')
                .setDescription('Request a new feature')
                .addStringOption(option => option.setName('request').setDescription('Enter your feature request').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all feature requests')
        ),
    async execute(interaction) {
        // If the interaction is not a slash command, return
        if (!interaction.isCommand()) return;

        // If the slash command is /feature and subcommand is request, execute this code
        if (interaction.commandName === 'feature' && interaction.options.getSubcommand() === 'request') {
            // create master embed
            const embed = new EmbedBuilder()
            .setTitle('Feature Request | REQUEST')
            .setTimestamp()
            .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

            try {
                const request = interaction.options.getString('request');
                const userID = interaction.user.id;

        
                // check if user has exceeded max requests per week
                const maxRequestsPerWeek = 5;
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

                // create new connection 
                const mysqlConnection = connectToDatabase();
                
                // connect to database
                mysqlConnection.connect();

                // check if user has exceeded max requests per week
                mysqlConnection.query('SELECT COUNT(*) AS count FROM featureRequests WHERE createdBy = ? AND createdAt > ?', [userID, oneWeekAgo], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    const requestCount = results[0].count;
                    if (requestCount >= maxRequestsPerWeek) {
                        // set embed color to red
                        embed.setColor(0xFF0000);
                        // if the user has exceeded the max requests per week, return with an embed description for the error
                        embed.setDescription(`You have already made ${maxRequestsPerWeek} feature requests this week. Please try again next week.`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                });

                // cleanse input string
                const cleansedRequest = request.replace(/'/g, "''");

                // insert request into database
                mysqlConnection.query('INSERT INTO featureRequests (request, createdBy) VALUES (?, ?)', [cleansedRequest, userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                });
        
                // disconnect from database
                mysqlConnection.end();

                // add embed description
                embed.setColor(0x22c2fc);
                embed.setDescription(`Thank you for your feature request: "${request}"`);

                // reply to user
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(error);

                // set embed color to red
                embed.setColor(0xFF0000);
                
                // add embed description
                embed.setDescription(`There was an error while executing this command!  Error has been logged!`);

                // create new connection 
                const mysqlConnection = connectToDatabase();
                
                // connect to database
                mysqlConnection.connect();

                // cleanse input string
                const cleansedError = error.replace(/'/g, "''");

                // get user id
                const userID = interaction.user.id;

                // insert request into database
                mysqlConnection.query('INSERT INTO botErrorsLog (errorMessage, errorLocation, encounteredBy) VALUES (?)', [cleansedError, '../commands/features.js     Feature Request', userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                });

                // reply to user
                await interaction.reply({ embeds: [embed], ephemeral: true });

                // disconnect from database
                mysqlConnection.end();
            }
        }

        // If the slash command is /feature and subcommand is list, execute this code
        if (interaction.commandName === 'feature' && interaction.options.getSubcommand() === 'list') {
            // create master embed
            const errorEmbed = new EmbedBuilder()
            .setTitle('Feature Request | LIST')
            .setTimestamp()
            .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

            try {
                // get user id
                const userID = interaction.user.id;
                
                // create new connection 
                const mysqlConnection = connectToDatabase();
                
                // connect to database
                mysqlConnection.connect();
        
                // get all feature requests from user
                mysqlConnection.query('SELECT * FROM featureRequests WHERE createdBy = ?', [userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    const requestCount = results.length;
                    if (requestCount === 0) {
                        // set embed color to red
                        errorEmbed.setColor(0xFF0000);
                        // if the user has exceeded the max requests per week, return with an embed description for the error
                        errorEmbed.setDescription(`You have not made any feature requests.`);

                        // disconnect from database
                        mysqlConnection.end();

                        // reply to user
                        return interaction.reply({ embeds: [errorEmbed] });

                    }
        
                    const featuresListEmbed = new EmbedBuilder()
                        .setColor(0x22c2fc)
                        .setTitle('Your Feature Requests')
                        .setURL('https://NoahOsterhout.com')
                        .setAuthor({ name: '@NoahFlowa & @wymiller', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256', url: 'https://NoahOsterhout.com' })
                        .setDescription('Here are all of your feature requests for The Boyos Bot.')
                        .setThumbnail('https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=1024')
                        .setTimestamp()
                        .addFields(
                            { name: 'Request', value: 'Date' },
                            { name: '\u200B', value: '\u200B'},
                        )
                        .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });
        
                        for (const request of results) {
                            const localDate = new Date(request.createdAt);
                            const localDateString = localDate.toLocaleString('en-US', { timeZone: 'America/Detroit' });
                            featuresListEmbed.addFields(
                                { name: request.request, value: localDateString, inline: true },
                                { name: '\u200B', value: '\u200B' },
                            );
                        }
        
                    return interaction.reply({ embeds: [featuresListEmbed] });
                });
        
                // disconnect from database
                mysqlConnection.end();
            } catch (error) {
                console.error(error);
                // set embed color to red
                errorEmbed.setColor(0xFF0000);
                // add embed description
                errorEmbed.setDescription(`There was an error while executing this command!  Error has been logged!`);

                // reply to user
                await interaction.reply({ embeds: [errorEmbed] });

                // create new connection 
                const mysqlConnection = connectToDatabase();
                
                // connect to database
                mysqlConnection.connect();

                // cleanse input string
                const cleansedError = error.replace(/'/g, "''");

                // get user id
                const userID = interaction.user.id;

                // insert request into database
                mysqlConnection.query('INSERT INTO botErrorsLog (errorMessage, errorLocation, encounteredBy) VALUES (?)', [cleansedError, '../commands/features.js     Feature List', userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    };
                });

                // disconnect from database
                mysqlConnection.end();
            }
        }
    },
};  