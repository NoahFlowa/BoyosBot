async function getInvite(guild) {
    try {
        const newInvites = await guild.invites.fetch();

        if (!guild.invites || guild.invites.size === 0) {
        guild.invites = newInvites;
        return newInvites.first();
        }

        const oldInvites = guild.invites;
        let foundInvite = null;

        for (const [code, newInvite] of newInvites) {
        const oldInvite = oldInvites.get(code);

        if (!oldInvite || newInvite.uses > oldInvite.uses) {
            guild.invites.set(code, newInvite);
            foundInvite = newInvite;
            break;
        }
        }

        return foundInvite;
    } catch (error) {
        console.error('Error in getInvite:', error.message);
        return null;
    }
}
  
module.exports = { getInvite };