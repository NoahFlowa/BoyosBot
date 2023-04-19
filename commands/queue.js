// Require the necessaary discord.js classes
const { Queue, queueMap } = require('./queueManager');
const { SlashCommandBuilder } = require("discord.js");
const { Queue, queueMap } = require("./queueManager");
const ytSearch = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Manage the song queue')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a song to the queue')
                .addStringOption(option =>
                    option
                        .setName('input')
                        .setDescription('The YouTube URL or search query')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a song from the queue by its position')
                .addIntegerOption(option =>
                    option
                        .setName('position')
                        .setDescription('Position of the song in the queue')
                        .setRequired(true))),
    async execute(interaction) {
        const guildId = interaction.guildId;
        let queue = queueMap.get(guildId);
        if (!queue) {
            queue = new Queue();
            queueMap.set(guildId, queue);
        }

        if (interaction.options.getSubcommand() === 'add') {
            const input = interaction.options.getString('input');
            await interaction.reply(`Searching for ${input}...`);
            const videos = await ytSearch(input);

            if (!videos || !videos.videos || !videos.videos.length) {
                await interaction.followUp('No videos found.');
                return;
            }

            const video = videos.videos[0];
            queue.add(video);
            await interaction.followUp(`Added to the queue: ${video.title} (${video.url})`);
        } else if (interaction.options.getSubcommand() === 'remove') {
            const position = interaction.options.getInteger('position');
            if (position > 0 && position <= queue.songs.length) {
                const removedSong = queue.songs.splice(position - 1, 1);
                await interaction.reply(`Removed from the queue: ${removedSong[0].title} (${removedSong[0].url})`);
            } else {
                await interaction.reply('Invalid position.');
            }
        }
    },
};
