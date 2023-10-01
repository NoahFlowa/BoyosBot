// Import logError function
const { logError } = require('../functions/logError.js');

module.exports = {
	name: 'leagueEvent',
	once: false,
	async execute(oldPresence, newPresence) {
		const member = newPresence.member;
		const activities = member.presence.activities;

		for (let activity of activities) {
			if (activity.type === 'PLAYING' && activity.name === 'League of Legends') {

				try {
					// Notify the user that they will be "banned" in 30 minutes
					await member.user.send('You will be banned in 30 minutes for playing League of Legends!');

					let timeRemaining = 30;  // time remaining in minutes

					const intervalId = setInterval(async () => {
						timeRemaining -= 10;
						if (timeRemaining <= 5) {
							// Notify the user of the final 5 minutes
							await member.user.send(`You will be "banned" in ${timeRemaining} minutes!`);
							clearInterval(intervalId);  // stop the interval
						} else {
							// Notify the user of the time remaining every 10 minutes
							await member.user.send(`You will be "banned" in ${timeRemaining} minutes!`);
						}
					}, 10 * 60 * 1000);  // 10 minutes in milliseconds

					// "Ban" the user after 30 minutes
					setTimeout(async () => {
						console.log(`${member.user.username} is "banned" for playing League of Legends!`);

                        // Ban the user from the server
                        //await member.ban({ reason: 'Playing League of Legends' });

						await member.user.send('You have been "banned" for playing League of Legends!');
					}, 30 * 60 * 1000);  // 30 minutes in milliseconds

				} catch (error) {
					console.error(`Error executing prank on ${member.user.username}`);
					console.error(error);

					// Get userID
					const userID = member.user.id;

					// Log the error via the logError function
					logError(`Error executing prank on ${member.user.username}`, 'events/leagueEvent.js', userID);
				}
			}
		}
	},
};