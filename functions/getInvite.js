async function getInvite(guild) {
    const newInvites = await guild.fetchInvites();
    const oldInvites = guild.invites;

    const usedInvite = newInvites.find(inv => {
        const oldInvite = oldInvites.get(inv.code);
        return (oldInvite && inv.uses > oldInvite.uses) || (!oldInvite && inv.uses === 1);
    });

    guild.invites = newInvites;

    return usedInvite;
}

module.exports = { getInvite };