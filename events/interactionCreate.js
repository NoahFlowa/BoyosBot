const { EmbedBuilder } = require('@discordjs/builders');

// Import logError function
const { logError } = require('../functions/logError.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {

		// create the embed
		const embed = new EmbedBuilder()
			.setTitle('Command Information')
			.setColor(0xff0000)
			.setDescription(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`)
			.setTimestamp()
			.setFooter({ text: 'The Boyos Bot', iconURL: 'https://cdn.discordapp.com/avatars/1037147995940073533/cf9144e290ee7a0b8a06152ac8228410.png?size=256' });

		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			// log the error to the database

			// Get userID
			const userID = interaction.user.id;

			// Get command name
			const commandName = interaction.commandName;

			// Get file name which is in the commands directory and the file name is the same as the command name
			const fileName = `commands/${commandName}.js`;

			// Log the error via the logError function
			logError(`No command matching ${interaction.commandName} was found.`, fileName, userID);

			// add the error message to the embed
			embed.addFields({ name: 'Error Message', value: `No command matching ${interaction.commandName} was found.  Error has been logged!` });

			//reply to the user
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);

			// Get userID
			const userID = interaction.user.id;

			// Get command name
			const commandName = interaction.commandName;

			// Get file name which is in the commands directory and the file name is the same as the command name
			const fileName = `commands/${commandName}.js`;

			// Log the error via the logError function
			logError(`No command matching ${interaction.commandName} was found.`, fileName, userID);

			// reply to the user that the command failed and the error has been logged using embed
			embed.addFields({ name: 'Error Message', value: `Error executing ${interaction.commandName}.  Error has been logged!` });

			//reply to the user
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
