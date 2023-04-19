const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { queueMap } = require('../classes/queueManager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Makes the bot join the voice channel the user is in.'),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			await interaction.reply('You need to be in a voice channel to use this command.');
			return;
		}

		const guildId = interaction.guildId;
		const queue = queueMap.get(guildId);

		if (queue && queue.connection) {
			await interaction.reply('I am already in a voice channel. Please wait until I am available.');
			return;
		}

		joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		await interaction.reply('Joined the voice channel!');
	},
};