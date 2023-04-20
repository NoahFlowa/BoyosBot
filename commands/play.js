// Require the necessary discord.js classes
const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');
const { Queue, queueMap } = require('../classes/queueManager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays music in a voice channel requested by the user!')
		.addStringOption(option => option.setName('input').setDescription('The YouTube URL or search query').setRequired(true)),
    async execute(interaction) {
        // If the interaction is not a slash command, return
        if (!interaction.isCommand()) return;
    
        // If the slash command is /play, execute this code
        if (interaction.commandName === 'play') {
            // Get the user input from the command option
            const input = interaction.options.getString('input');
    
            // Defer the reply to the interaction
            await interaction.reply({ content: 'Processing your request...', ephemeral: false });
    
            try {
                let video;
    
                // Check if input is a valid URL
                if (ytdl.validateURL(input)) {
                    // Get the video information from the URL
                    video = await ytdl.getInfo(input);
                } else {
                    // Search for youtube videos using yt-search
                    const videoResult = await ytSearch(input);

                    // If no videos are found, reply with an error message and return
                    if (!videoResult || !videoResult.videos || !videoResult.videos.length) {
                        await interaction.editReply('No videos found.');
                        return;
                    }

                    // Get the first video from the search results
                    video = await ytdl.getInfo(videoResult.videos[0].url);

                    // Check if the video is defined
                    if (!video) {
                        await interaction.editReply('No videos found.');
                        return;
                    }
                }
    
                // Get the voice channel of the user who requested the command
                const channel = interaction.member.voice.channel;
    
                // If the user is not in a voice channel, reply with an error message and return
                if (!channel) {
                    await interaction.editReply('You need to be in a voice channel to play music.');
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
    
                // If there is no connection, join the voice channel and set the connection
                if (!queue.connection) {
                    queue.connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    });
                }
    
                // Check if there is a queue
                if (queue.songs.length === 0) {
                    // If no queue, play the song immediately
                    queue.add(video);
                    queue.play();
                    await interaction.editReply(`Now playing: ${video.title} (${video.url})`);
                } else {
                    // If there is a queue, add the song to the end of the queue
                    queue.add(video);
                    await interaction.editReply(`Added to the queue: ${video.title} (${video.url})`);
                }
            } catch (error) {
                // If there is an error, reply with an error message and return
                console.error('Error searching for video:', error);
                await interaction.editReply('There was a problem searching for the video. Please try again later.');
            }
        }
    },        
};