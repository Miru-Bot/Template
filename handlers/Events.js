const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = async(client) => {
    const path = join(process.cwd(), "Events");
    console.log("[Handlers]", path, "opened...");
    
    const clientPath = join(path, "Client");
    const events1 = readdirSync(clientPath);
    for (const file of events1) {
        const events = require(join(clientPath, file));
        
        client.on(events.name, events.run);
    }
    
    console.log("[Handlers]", path, "loaded!", `${events1.length} file`);
}