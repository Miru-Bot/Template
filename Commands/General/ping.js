const { join } = require("node:path");
const structurePath = join(process.cwd(), "structures");
const CommandInterface = require(join(structurePath, "CommandInterface"));

module.exports = new CommandInterface({
    data: {
        type: 1,
        name: "ping",
        description: "Sending bot latency"
    },
    async execute(i) {
        await i.deferReply();
        
        const timestamp = await Date.now();
        
        const embed = new i.EmbedBuilder()
            .setDescription("> Runtime service latency")
            .addFields(
                {
                    name: "Client Websocket",
                    value: `> ${i.client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: "Sending Message",
                    value: `> ${timestamp - i.createdTimestamp}ms`,
                    inline: true
                }
            );
        
        await i.editReply({ embeds: [embed] });
        return;
    }
});