const { SlashCommandBuilder } = require('discord.js');
const { queueMap } = require('../classes/queueManager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Stops playing music, clears the queue, and leaves the voice channel.'),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const queue = queueMap.get(guildId);

		if (!queue || !queue.connection) {
			await interaction.reply('I am not currently in a voice channel.');
			return;
		}

		queue.stop();
		queueMap.delete(guildId);
		await interaction.reply('Stopped playing music, cleared the queue, and left the voice channel.');
	},
};