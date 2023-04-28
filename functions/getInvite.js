async function getInvite(guild) {
    const newInvites = await guild.invites.fetch(); // Update this line
    const oldInvites = guild.invites;
    guild.invites = newInvites;
    
    const invite = newInvites.find(inv => {
        const oldInvite = oldInvites.get(inv.code);
        return !oldInvite || inv.uses > oldInvite.uses;
    });

    return invite;
}

module.exports = { getInvite };