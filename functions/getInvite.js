async function getInvite(guild) {
    try {
        const newInvites = await guild.invites.fetch();

        if (!guild.invites || guild.invites.size === 0) {
            guild.invites = newInvites;
            return newInvites.first();
        }

        const oldInvites = guild.invites.fetch(guild.id);
        let foundInvite;

        newInvites.forEach((newInvite) => {
            const oldInvite = oldInvites.get(newInvite.code);
            if (oldInvite && newInvite.uses > oldInvite.uses) {
                foundInvite = newInvite;
            }
          });
      

        return foundInvite;
    } catch (error) {
        console.error('Error in getInvite:', error.message);
        return null;
    }
}

module.exports = { getInvite };