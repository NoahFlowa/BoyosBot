// Require the necessary discord.js classes
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feature')
        .setDescription('Request a new feature for the bot')
        .addStringOption(option => option.setName('request').setDescription('Enter your feature request').setRequired(true)),
    async execute(interaction) {
      const request = interaction.options.getString('request');
      const userID = interaction.user.id;
  
      // check if user has exceeded max requests per week
      const maxRequestsPerWeek = 5;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      const [result] = await pool.query('SELECT COUNT(*) AS count FROM featureRequests WHERE createdBy = ? AND createdAt > ?', [userID, oneWeekAgo]);
      const requestCount = result[0].count;
      if (requestCount >= maxRequestsPerWeek) {
        return await interaction.reply(`You have already made ${maxRequestsPerWeek} feature requests this week. Please try again next week.`);
      }
  
      // cleanse input string
      const cleansedRequest = request.replace(/'/g, "''");
  
      // insert request into featureRequests table
      await pool.query('INSERT INTO featureRequests (request, createdBy) VALUES (?, ?)', [cleansedRequest, userID]);
      
      await interaction.reply(`Thank you for your feature request: "${request}"`);
    },
};  