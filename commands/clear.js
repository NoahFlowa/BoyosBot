// Import the required libraries
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

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

// Create the SlashCommand data
const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear a specified number of messages in the current channel.')
  .addIntegerOption((option) =>
    option
      .setName('amount')
      .setDescription('The number of messages to delete (max 50).')
      .setRequired(true)
  );

/**
 * Executes the clear command.
 * @param {CommandInteraction} interaction - The interaction that triggered the command.
 */
async function execute(interaction) {
  // Connect to the database
  const mysqlConnection = connectToDatabase();

  // Check if the user exists in the database and has permission to use the command
  mysqlConnection.query(
    `SELECT * FROM users WHERE userID = '${interaction.user.id}' AND permissions = 1`,
    async function (error, results) {
      if (error) {
        mysqlConnection.end();
        console.error(error);
        return interaction.reply({
          content: 'An error occurred while checking your permissions.',
          ephemeral: true,
        });
      }

      if (results.length === 0) {
        // User does not exist or does not have permission
        const embed = new EmbedBuilder()
          .setTitle('Clear command')
          .setColor(0xFF0000)
          .setDescription('You do not have permission to use this command.');

        mysqlConnection.end();
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // User exists and has permission
      // Get the amount option from the interaction
      const amount = interaction.options.getInteger('amount');

      // Check if the amount is valid (between 1 and 50)
      if (amount < 1 || amount > 50) {
        mysqlConnection.end();
        return interaction.reply({
          content: 'The amount must be between 1 and 50.',
          ephemeral: true,
        });
      }

      // Delete the specified number of messages (+1 to include the command message)
      try {
        await interaction.channel.bulkDelete(amount + 1, true);
        const reply = await interaction.reply({
          content: `Deleted ${amount} messages.`,
          ephemeral: true,
        });

        // Delete the reply after 3 seconds
        setTimeout(() => {
          reply.delete();
        }, 3000);
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: 'An error occurred while trying to delete messages.',
          ephemeral: true,
        });
      } finally {
        // Close the database connection
        mysqlConnection.end();
      }
    }
  );
}

// Export the command data and the execute function
module.exports = {
  data,
  execute,
};