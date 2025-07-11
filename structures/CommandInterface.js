const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const ClientInterface = require("./ClientInterface");

class CommandInterface {
    constructor(options) {
        this.data = options?.data || new SlashCommandBuilder();
        this.setPermissions(options?.permissions);
        this.aliases = options?.aliases || [];
        this.cooldown = options?.cooldown || 3000;
        this.private = options?.private || false;
        this.execute = options?.execute || function execute(){};
    }
    setPermissions(permissions=[]) {
        this.permissions = ["EmbedLinks"];
        for (const perm of permissions) {
            if (perm) this.permissions.push(perm);
        }
        return this.permissions;
    }
    async bind(data, args) {
        const i = new ClientInterface(data, args);
        
        if (this.private && i.authorId !== i.config.developerId) return;

        const missingPermissions = [];
        for (const perm of this.permissions) {
            if (!i.channel.permissionsFor(i.guild.members.me).has(perm)) missingPermissions.push(perm);
        }

        if (missingPermissions.length > 0) {
            const content = `Missing permissions \`${missingPermissions.join(", ")}\`! Please double check them in your server role & channel settings.`;

            await i.reply({ content, flags: [MessageFlags.Ephemeral] });
            return;
        }

        this.execute(i);

        console.log(`[CommandUsage] ${this?.data?.name} | ${i.author.username} - ${i.authorId} | ${i.guild.name} - ${i.guildId}`);
    }
}

module.exports = CommandInterface;