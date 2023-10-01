const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { connectToDatabase } = require('../functions/databaseConnection.js');

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
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'feature' && interaction.options.getSubcommand() === 'request') {
            const embed = new EmbedBuilder()
                .setTitle('Feature Request | REQUEST')
                .setTimestamp()
                .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

            try {
                const request = interaction.options.getString('request');
                const userID = interaction.user.id;
                const maxRequestsPerWeek = 5;
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
                const mysqlConnection = connectToDatabase();
                mysqlConnection.connect();
                mysqlConnection.query('SELECT COUNT(*) AS count FROM featureRequests WHERE createdBy = ? AND createdAt > ?', [userID, oneWeekAgo], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    const requestCount = results[0].count;
                    if (requestCount >= maxRequestsPerWeek) {
                        embed.setColor(0xFF0000);
                        embed.setDescription(`You have already made ${maxRequestsPerWeek} feature requests this week. Please try again next week.`);
                        mysqlConnection.end();
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                    const cleansedRequest = request.replace(/'/g, "''");
                    mysqlConnection.query('INSERT INTO featureRequests (request, createdBy) VALUES (?, ?)', [cleansedRequest, userID], function (error, results, fields) {
                        if (error) {
                            mysqlConnection.end();
                            throw error;
                        }
                        mysqlConnection.end();
                        embed.setColor(0x22c2fc);
                        embed.setDescription(`Thank you for your feature request: "${request}"`);
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    });
                });
            } catch (error) {
                console.error(error);
                embed.setColor(0xFF0000);
                embed.setDescription(`There was an error while executing this command! Error has been logged!`);
                const mysqlConnection = connectToDatabase();
                mysqlConnection.connect();
                const cleansedError = error.message.replace(/'/g, "''");
                mysqlConnection.query('INSERT INTO botErrorsLog (errorMessage, errorLocation, encounteredBy) VALUES (?, ?, ?)', [cleansedError, '../commands/features.js Feature Request', userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    mysqlConnection.end();
                    interaction.reply({ embeds: [embed], ephemeral: true });
                });
            }
        }

        if (interaction.commandName === 'feature' && interaction.options.getSubcommand() === 'list') {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Feature Request | LIST')
                .setTimestamp()
                .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

            try {
                const userID = interaction.user.id;
                const mysqlConnection = connectToDatabase();
                mysqlConnection.connect();
                mysqlConnection.query('SELECT * FROM featureRequests WHERE createdBy = ?', [userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    const requestCount = results.length;
                    if (requestCount === 0) {
                        errorEmbed.setColor(0xFF0000);
                        errorEmbed.setDescription(`You have not made any feature requests.`);
                        mysqlConnection.end();
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
                            { name: '\u200B', value: '\u200B' },
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

                    mysqlConnection.end();  // Moved to here, after handling results
                    return interaction.reply({ embeds: [featuresListEmbed] });
                });
            } catch (error) {
                console.error(error);
                errorEmbed.setColor(0xFF0000);
                errorEmbed.setDescription(`There was an error while executing this command! Error has been logged!`);
                const mysqlConnection = connectToDatabase();
                mysqlConnection.connect();
                const cleansedError = error.message.replace(/'/g, "''");
                mysqlConnection.query('INSERT INTO botErrorsLog (errorMessage, errorLocation, encounteredBy) VALUES (?, ?, ?)', [cleansedError, '../commands/features.js Feature List', userID], function (error, results, fields) {
                    if (error) {
                        mysqlConnection.end();
                        throw error;
                    }
                    mysqlConnection.end();
                    interaction.reply({ embeds: [errorEmbed] });
                });
            }
        }
    },
};