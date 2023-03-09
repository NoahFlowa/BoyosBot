const { SlashCommandBuilder, InteractionResponse } = require("discord.js");
const { Queue, queueMap } = require("play.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the player and _doesn\'t_ clear the queue'),
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'pause') {
      var failure = false;
      if (!player.queue) {
        player.queue.failures++;
        failure = true;
      }
      if (player.queue.failures >= 5) {
        //
      }
    }
  }
}
