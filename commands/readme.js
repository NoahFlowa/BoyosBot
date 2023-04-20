const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('readme')
		.setDescription('Tells you about the bot.'),
	async execute(interaction) {
        const readmeEmbed = new EmbedBuilder()
        .setColor(0x22c2fc)
        .setTitle('About The Boyos Bot')
        .setURL('https://NoahOsterhout.com')
        .setAuthor({ name: '@NoahFlowa & @wymiller', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256', url: 'https://NoahOsterhout.com' })
        .setDescription('The Boyos Bot is a bot created by Noah Osterhout and Wyatt Miller. It is a bot that is used to play music in a voice channel, and to moderate the server. It is a work in progress, and is currently in beta. If you have any questions, please contact Noah Osterhout or Wyatt Miller.')
        .setThumbnail('https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=1024')
        .addFields(
            { name: 'Commands available for the bot', value: '\u200B' },
            { name: '\u200B', value: '\u200B' },
            { name: 'ReadMe', value: 'Tells user about the bot', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Ping', value: 'Pong!', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Play', value: 'Pass a YouTube URL or search query for the bot to play music!', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Server', value: 'Tells user about the server', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Queue Play', value: 'Tells the bot to play the queue', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Join', value: 'Tells the bot to join the voice channel user is in', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Leave', value: 'Tells the bot to leave the voice channel', inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setImage('https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=1024')
        .setTimestamp()
        .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=1024'});

        await interaction.reply({ embeds: [readmeEmbed] });
	},
};