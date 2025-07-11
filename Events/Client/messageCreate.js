const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require ("discord.js");

module.exports = {
    name: "messageCreate",
    async run(client, message) {
        if (message.author.bot || !message.guild) return;

        const prefix = client.config.prefix;
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

        const embed = new EmbedBuilder().setColor(client.config.colors.main);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Invite").setURL(client.config.inviteUrl).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel("Support Server").setURL(client.config.discordUrl).setStyle(ButtonStyle.Link),
            new ButtonBuilder().setLabel("Website").setURL(client.config.websiteUrl).setStyle(ButtonStyle.Link),
        );

        if (message.content.match(mention)) {
            embed.setDescription(`Use \`${prefix}help\` command to get list of commands.`);

            message.reply({ embeds: [embed], components: [row] });
            return;
        }

        const rawContent = message.content.toLowerCase();
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.user.username.toLowerCase()}|${escapeRegex(prefix)})\\s*`);

        if (!prefixRegex.test(rawContent)) return;

        const [matchedPrefix] = rawContent.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (!cmd.length) return;

        const command = client.commands.get(cmd) ?? client.commands.find(command => command.aliases.includes(cmd));

        if (command) {
            const botPermissions = ["ViewChannel", "SendMessages"];
            const missingPermissions = [];

            for (const perm of botPermissions) {
                if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) missingPermissions.push(perm);
            }

            if (missingPermissions.length > 0) {
                const content = `The bot doesn't have one of these permissions \`${missingPermissions.join(", ")}\`.\nPlease double check them in your server role & channel settings.\n\nServer: **${message.guild.name}**`;

                const dmChannel = message.author.dmChannel || await message.author.createDM();

                return dmChannel.send({ content });
            }
            command.bind(message, args);
        }
    }
}