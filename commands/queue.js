// Require the necessary discord.js classes
const { SlashCommandBuilder } = require('discord.js');
const { queueMap } = require('../classes/queueManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Manage the music queue')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Start playing the queue')
        ),
    async execute(interaction) {
        // If the interaction is not a slash command, return
        if (!interaction.isCommand()) return;

        // If the slash command is /queue, execute this code
        if (interaction.commandName === 'queue') {
            // Get the guild id of the interaction
            const guildId = interaction.guildId;

            // Get the queue for the guild
            const queue = queueMap.get(guildId);

            // If there's no queue, reply with an error message and return
            if (!queue) {
                await interaction.reply('There is no queue for this server.');
                return;
            }

            // If the subcommand is "play", execute this code
            if (interaction.options.getSubcommand() === 'play') {
                // If the bot is already playing, reply with an error message and return
                if (queue.player && queue.player.state.status !== 'idle') {
                    await interaction.reply('The bot is already playing.');
                    return;
                }

                // If the queue is empty, reply with an error message and return
                if (queue.songs.length === 0) {
                    await interaction.reply('The queue is empty.');
                    return;
                }

                // Start playing the queue
                queue.play();
                await interaction.reply('Starting to play the queue.');
            }
        }
    },
};
