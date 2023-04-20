const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about The Boyos Server.'),
	async execute(interaction) {

		// convert the above to a embed message
		const embed = new EmbedBuilder()
			.setTitle('Server Information for The Boyos')
			.setDescription(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`)
			.setColor(0x22c2fc)
			.setTimestamp()
			.setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });
		await interaction.reply({ embeds: [embed] });
	},
};