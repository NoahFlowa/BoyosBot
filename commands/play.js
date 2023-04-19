// Require the necessary discord.js classes
const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { Queue, queueMap } = require('../classes/queueManager');

// Require sodium for encryption
const sodium = require('sodium');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays music in a voice channel requested by the user!')
		.addStringOption(option => option.setName('input').setDescription('The YouTube URL or search query').setRequired(true)),
	async execute(interaction) {
		const input = interaction.options.getString('input');
		const channel = interaction.member.voice.channel;

		if (!channel) {
			await interaction.reply('You need to be in a voice channel to play music.');
			return;
		}

		const guildId = interaction.guildId;
		let queue = queueMap.get(guildId);

		if (!queue) {
			queue = new Queue();
			queue.connection = await interaction.member.voice.channel.join();
			queueMap.set(guildId, queue);
		}

		await interaction.deferReply();

		try {
			const videos = await ytSearch(input);

			if (!videos || !videos.videos || !videos.videos.length) {
				await interaction.followUp('No videos found.');
				return;
			}

			const video = videos.videos[0];

			if (queue.player.state.status !== 'idle') {
				queue.add(video);
				await interaction.followUp(`Added to the queue: ${video.title} (${video.url})`);
			} else {
				queue.add(video);
				queue.play();
				await interaction.followUp(`Now playing: ${video.title} (${video.url})`);
			}
		} catch (error) {
			console.error('Error searching for video:', error);
			await interaction.followUp('There was a problem searching for the video. Please try again later.');
		}
	},
};