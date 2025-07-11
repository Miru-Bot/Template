module.exports = {
    name: "interactionCreate",
    async run(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const botPermissions = ["ViewChannel", "SendMessages"];
        const missingPermissions = [];

        for (const perm of botPermissions) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) missingPermissions.push(perm);
        }

        if (missingPermissions.length > 0) {
            const content = `The bot doesn't have this permissions \`${missingPermissions.join(", ")}\`.\nPlease double check them in your server role & channel settings.\n\nServer: **${interaction.guild.name}**`;

            const dmChannel = interaction.user.dmChannel || await interaction.user.createDM();

            return dmChannel.send({ content });
        }

        const args = interaction.options.data;
        const command = client.commands.get(interaction.commandName);

        if (!command) command.bind(interaction, args);
    }
}