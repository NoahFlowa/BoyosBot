const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const changesArray = [
    {
        "changes": [
            "/changes will tell you about the changes to the bot.",
            "/clear will allow certain users to clear messages in a channel.",
            "/cowboyindian will allow you to play the anual Cowboy vs. Indians game in the server.",
            "/feature will allow you to request a feature to be added to the bot.",
            "/gameserver will allow you to list, add, or remove a game server from the list.",
            "/join will make the bot join the voice channel you are in.",
            "/leave will make the bot leave the voice channel it is in.",
            "/ping will allow you to see the ping of the bot.",
            "/play will allow you to play music in the voice channel the bot is in.",
            "/queue will allow you to see the queue of songs that are going to be played.",
            "/readme will allow you to see the readme file for the bot.",
            "/server will allow you to see information about the server.",
            "/user will allow you to see information about you.",
        ]
    }
];

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
        )
        .setTimestamp()
        .setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

        // loop through the changesArray
        changesArray.forEach((change) => {
            change.changes.forEach((change) => {
                changesEmbed.addFields({ name: 'Added Command', value: `${change.changes}`, inline: true });
                changesEmbed.addFields({ name: '\u200B', value: '\u200B' });
            });
        });

        await interaction.reply({ embeds: [changesEmbed] });
    },
};