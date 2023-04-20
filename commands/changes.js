const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changes')
        .setDescription('Tells you about the changes to the bot.'),
    async execute(interaction) {
        const changesEmbed = new EmbedBuilder()
        .setColor(0x22c2fc)
        .setTitle('The Boyos Bot Changes')
        .setURL('https://NoahOsterhout.com')
        .setAuthor({ name: '@NoahFlowa & @wymiller', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256', url: 'https://NoahOsterhout.com' })
        .setDescription('The Boyos Bot is a bot created by Noah Osterhout and Wyatt Miller. It is a bot that is used to play music in a voice channel, and to moderate the server. It is a work in progress, and is currently in beta. If you have any questions, please contact Noah Osterhout or Wyatt Miller.')
        .setThumbnail('https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=1024')
        .addFields(
            { name: 'If you would like a feature added to the bot, please use the feature request command.', value: '\u200B'},
            { name: 'Changes to the bot', value: '\u200B' },
            { name: 'Added a new command', value: 'Added a new command called changes. This command will tell you about the changes to the bot.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Added a new command', value: 'Added a new command called feature list. This command will retrieve all of your requested features for the bot.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Added a new command', value: 'Added a new command called feature request. This command will allow you to send a new feature request for the bot.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Added a new command', value: 'Added a new command called queue play. This command will tell the bot to play the queue.', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Added a new command', value: 'Added a new command called server. This command will tell you basic information about the server.', inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setTimestamp()
        .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

        await interaction.reply({ embeds: [changesEmbed] });
    },
};