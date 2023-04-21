// Require the necessary discord.js classes
const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
const { validate, video_info, search } = require('play-dl');
const { Queue, queueMap } = require('../classes/queueManager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays music in a voice channel requested by the user!')
		.addStringOption(option => option.setName('input').setDescription('The YouTube URL or search query').setRequired(true)),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
    
        if (interaction.commandName === 'play') {
            const input = interaction.options.getString('input');
            await interaction.deferReply();
    
            try {
                let video;
    
                if (validate(input, 'spotify')) {
                    const spotifyTrackInfo = await video_info(input);
                    const trackName = `${spotifyTrackInfo.name} ${spotifyTrackInfo.artists[0].name}`;
                    const searchResults = await search(trackName, { limit: 1, type: 'video' });
                    video = await extract(searchResults[0].url);
                } else {
                    const searchResults = await search(input, { limit: 1, type: 'video' });
                    video = await extract(searchResults[0].url);
                }
    
                if (!video || video.LiveStreamData.isLive) {
                    await interaction.editReply('No suitable videos found.');
                    return;
                }
    
                await playVideo(interaction, video);
            } catch (error) {
                console.error('Error searching for video:', error);
                await interaction.editReply('There was a problem searching for the video. Please try again later.');
            }
        }
    },
};

async function playVideo(interaction, video) {
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
}