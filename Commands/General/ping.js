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
        const start = Date.now();
        await i.deferReply();
        
        const embed = new i.EmbedBuilder()
            .setDescription("Runtime service latency")
            .addFields(
                {
                    name: "Client Websocket",
                    value: `> ${i.client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: "Sending Message",
                    value: `> ${Date.now() - start}ms`,
                    inline: true
                }
            );
        
        await i.editReply({ embeds: [embed] });
        return;
    }
});