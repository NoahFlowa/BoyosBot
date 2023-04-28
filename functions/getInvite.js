const getInvite = async (guild) => {
    try {
        // Fetch the current invites from the guild
        const newInvites = await guild.invites.fetch();

        // Fetch the old invites from the guild.invites property or create an empty Map
        const oldInvites = guild.invites || new Map();

        // Find the used invite by comparing the newInvites and oldInvites
        const usedInvite = newInvites.find((invite) => {
            const oldInvite = oldInvites.get(invite.code);
            return oldInvite ? invite.uses > oldInvite.uses : false;
        });

        // Update the guild.invites property with the newInvites
        guild.invites = newInvites;

        return usedInvite;
    } catch (error) {
        console.error(`Error in getInvite: ${error.message}`);
        return null;
    }
};

module.exports = {
    getInvite,
};