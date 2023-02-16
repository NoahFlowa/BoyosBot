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
        .setAuthor({ name: '@NoahFlowa & @wymiller', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('The Boyos Bot is a bot created by Noah Osterhout and Wyatt Miller. It is a bot that is used to play music in a voice channel, and to moderate the server. It is a work in progress, and is currently in beta. If you have any questions, please contact Noah Osterhout or Wyatt Miller.')
        .setThumbnail('https://cdn.discordapp.com/avatars/852202202000578580/0c1b2b0b0b0b0b0b0b0b0b0b0b0b0b0b.webp?size=256')
        .addFields(
            { name: 'Commands available for the bot', value: '\u200B' },
            { name: '\u200B', value: '\u200B' },
            { name: 'About', value: 'Tells user about the bot', inline: true },
            { name: 'Ping', value: 'Pong!', inline: true },
            { name: 'Play', value: 'Pass a YouTube URL or search query for the bot to play music!', inline: true },
            { name: 'Server', value: 'Tells user about the server', inline: true },
            { name: 'User', value: 'Tells user about user', inline: true },
        )
        .setImage('https://cdn.discordapp.com/avatars/852202202000578580/0c1b2b0b0b0b0b0b0b0b0b0b0b0b0b0b.webp?size=256')
        .setTimestamp()
        .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/852202202000578580/0c1b2b0b0b0b0b0b0b0b0b0b0b0b0b0b.webp?size=256'});

        await interaction.reply({ embeds: [readmeEmbed] });
	},
};