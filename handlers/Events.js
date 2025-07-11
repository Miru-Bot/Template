const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = async(client) => {
    const path = join(process.cwd(), "Events");
    console.log("[Handlers]", path, "opened...");
    
    const events1 = readdirSync(join(path, "Client"));
    for (const file of events1) {
        const events = join(path, file);
        
        client.on(events.name, events.run);
    }
    
    console.log("[Handlers]", path, "loaded!", `${events1.length} file`);
}