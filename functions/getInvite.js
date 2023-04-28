async function getInvite(guild) {
    const newInvites = await guild.invites.fetch();
    const oldInvites = guild.invites;

    const invite = newInvites.find(inv => {
        const oldInvite = oldInvites.get(inv.code);
        return !oldInvite || inv.uses > oldInvite.uses;
    });

    guild.invites = new Collection();
    newInvites.each(invite => guild.invites.set(invite.code, invite));

    return invite;
}

module.exports = { getInvite };