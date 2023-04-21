const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

// Import mysql connection
const { connectToDatabase } = require('../functions/databaseConnection.js');

// Users table schema: (name, discordUserName, discordUderIS, permissionID)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Add a user to the database')
        .addStringOption(option => option.setName('name').setDescription('Name of the user').setRequired(true))
        .addStringOption(option => option.setName('discordusername').setDescription('Discord username of the user').setRequired(true))
        .addStringOption(option => option.setName('discorduserid').setDescription('Discord user ID of the user').setRequired(true))
        .addIntegerOption(option => option.setName('permissionid').setDescription('Permission ID of the user').setRequired(true)),
    async execute(interaction) {

        // Connect to database
        var mysqlConnection = connectToDatabase();
        mysqlConnection.connect();

        // Get values from interaction
        const name = interaction.options.getString('name');
        const discordUserName = interaction.options.getString('discordusername');
        const discordUserID = interaction.options.getString('discorduserid');
        const permissionID = interaction.options.getInteger('permissionid');

        // Insert user into database
        mysqlConnection.query(`INSERT INTO Users (name, discordUserName, discordUserID, permissionID) VALUES ('${name}', '${discordUserName}', '${discordUserID}', '${permissionID}')`, function (err, result, fields) {
            if (err) {
                mysqlConnection.end();
                throw err;
            }

            // Create embed
            const embed = new EmbedBuilder()
            .setTitle("User added")
            .setDescription("User added to the database")
            .addFields({ name: 'Name', value: `${name}` })
            .addFields({ name: 'Discord username', value: `${discordUserName}` })
            .addFields({ name: 'Discord user ID', value: `${discordUserID}` })
            .addFields({ name: 'Permission ID', value: `${permissionID}` })
            .setColor(0x22c2fc)
            .setTimestamp()
            .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

            // Close connection
            mysqlConnection.end();

            // Send embed
            interaction.reply({ embeds: [embed] });
        });
    },
}