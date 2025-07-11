const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = async(client) => {
    const path = join(process.cwd(), "Commands");
    console.log("[Handlers]", path, "opened...");
    
    const folders = readdirSync(path);
    for (const folder of folders) {
        const path1 = join(path, folder);
        const files = readdirSync(path1);
        files.forEach(file => {
            const path2 = join(path1, file);
            const commands = require(path);
            client.commands.set(commands.data.name, commands);
            client.on("ready", async() => {
                const appcmd = await client.application.commands.fetch();
                if (!appcmd.has(commands.name)) {
                    await appcmd.create(command.data);
                }
            });
        });
    }
    
    console.log("[Handlers]", path, "loaded!", `${client.commands.size} file`);
}