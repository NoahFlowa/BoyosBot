const { SlashCommandBuilder, InteractionResponse } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Pauses the player and _doesn\'t_ clear the queue'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'stop') {

        }
    }
}
