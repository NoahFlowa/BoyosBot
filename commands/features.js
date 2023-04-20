// Require the necessary discord.js classes
const { SlashCommandBuilder, MessageEmbed } = require("discord.js");

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
        .setName('feature')
        .setDescription('Request or list requested features for the bot.')
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
            try {
                const request = interaction.options.getString('request');
                const userID = interaction.user.id;
        
                // check if user has exceeded max requests per week
                const maxRequestsPerWeek = 5;
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

                // connect to database
                mysqlConnection.connect();

                // check if user has exceeded max requests per week
                mysqlConnection.query('SELECT COUNT(*) AS count FROM featureRequests WHERE createdBy = ? AND createdAt > ?', [userID, oneWeekAgo], function (error, results, fields) {
                    if (error) throw error;
                    const requestCount = results[0].count;
                    if (requestCount >= maxRequestsPerWeek) {
                        return interaction.reply(`You have already made ${maxRequestsPerWeek} feature requests this week. Please try again next week.`);
                    }
                });

                // cleanse input string
                const cleansedRequest = request.replace(/'/g, "''");

                // insert request into database
                mysqlConnection.query('INSERT INTO featureRequests (request, createdBy) VALUES (?, ?)', [cleansedRequest, userID], function (error, results, fields) {
                    if (error) throw error;
                });
        
                // disconnect from database
                mysqlConnection.end();

                // reply to user
                await interaction.reply(`Thank you for your feature request: "${request}"`);
            } catch (error) {
                console.error(error);
                await interaction.reply('There was an error while executing this command!');
            }
        }

        // If the slash command is /feature and subcommand is list, execute this code
        if (interaction.commandName === 'feature' && interaction.options.getSubcommand() === 'list') {
            try {
                // get user id
                const userID = interaction.user.id;
                
                // connect to database
                mysqlConnection.connect();

                // get all feature requests from user
                mysqlConnection.query('SELECT * FROM featureRequests WHERE createdBy = ?', [userID], function (error, results, fields) {
                    if (error) throw error;
                    const requestCount = results.length;
                    if (requestCount === 0) {
                        return interaction.reply(`There are no feature requests.`);
                    }

                    // Create the embed object
                    const embed = new MessageEmbed()
                        .setTitle(`Feature Requests From ${interaction.user.username}`)
                        .setColor('#22c2fc');
                    
                    const requestList = results.map(request => `**${request.request}**: ${request.createdAt}`).join('\n');
                    embed.setDescription(requestList);

                    // Send the embed
                    return interaction.reply({ embeds: [embed] });
                });

                // disconnect from database
                mysqlConnection.end();
            } catch (error) {
                console.error(error);
                await interaction.reply('There was an error while executing this command!');
            }
        }
    },
};  