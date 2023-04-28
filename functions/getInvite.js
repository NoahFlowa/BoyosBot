async function getInvite(guild) {
    const newInvites = await guild.invites.fetch();
    const oldInvites = guild.invites;

    const usedInvite = newInvites.find((invite) => {
        const oldInvite = oldInvites.find((old) => old.code === invite.code);
        return oldInvite && invite.uses > oldInvite.uses;
    });

    guild.invites = newInvites;
    return usedInvite;
}

module.exports = { getInvite };