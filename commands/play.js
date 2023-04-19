// Require the necessary discord.js classes
const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { Queue, queueMap } = require('./queueManager');

// Require sodium for encryption
const sodium = require('sodium');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music in a voice channel requested by the user!')
        // Add a string option for the youtube URL or search query
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The youtube URL or search query')
                .setRequired(true)
        ),
    async execute(interaction) {
        // If the interaction is not a slash command, return
        if (!interaction.isCommand()) return;

        // If the slash command is /play, execute this code
        if (interaction.commandName === 'play') {
            // Get the user input from the command option
            const input = interaction.options.getString('input');

            // Reply to the interaction with a message
            await interaction.reply(`Searching for ${input}...`);

            try {
                // Search for youtube videos using yt-search
                const videos = await ytSearch(input);

                // If no videos are found, reply with an error message and return
                if (!videos || !videos.videos || !videos.videos.length) {
                    await interaction.followUp('No videos found.');
                    return;
                }

                // Get the first video from the search results
                const video = videos.videos[0];

                // Get the voice channel of the user who requested the command
                const channel = interaction.member.voice.channel;

                // If the user is not in a voice channel, reply with an error message and return
                if (!channel) {
                    await interaction.followUp('You need to be in a voice channel to play music.');
                    return;
                }

                // Get the guild id of the interaction
                const guildId = interaction.guildId;

                // Get or create the queue for the guild
                let queue = queueMap.get(guildId);
                if (!queue) {
                    queue = new Queue();
                    queueMap.set(guildId, queue);
                }

                // Add the song to the queue
                queue.add(video);

                // If there is no connection, join the voice channel and set the connection
                if (!queue.connection) {
                    queue.connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    });
                }

                // Modify the error event listener in the queue class
                queue.player.on('error', error => {
                    // Log the error
                    console.error(error);
                    // Remove the errored song from the queue
                    queue.songs.shift();
                    // Play the next song
                    queue.play();
                    // Inform the user who requested the song that there was a problem
                    interaction.followUp(`${interaction.user}, there was a problem playing the song. Moving to the next song in the queue, if any.`);
                });

                // If there is only one song in the queue, play it
                if (queue.songs.length === 1) {
                    queue.play();
                    await interaction.followUp(`Now playing: ${video.title} (${video.url})`);
                } else {
                    // Otherwise, reply with a message that shows the song is added to the queue
                    await interaction.followUp(`Added to the queue: ${video.title} (${video.url})`);
                }
            } catch (error) {
            console.error('Error searching for video:', error);
            await interaction.followUp(`${interaction.user}, there was a problem searching for the video. Please try again later.`);
            }
        }
    },
};
