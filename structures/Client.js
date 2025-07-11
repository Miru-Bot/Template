const { Client, Collection, GatewayIntentBits } = require ("discord.js");
const { readdirSync } = require ("node:fs");
const { join } = require("node:path");

class MiruClient extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ["everyone", "users", "roles"],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        
        this.handlingError();
        
        this.commands = new Collection();
        this.config = require(join(process.cwd(), "config.js"));
        
        this.loadHandlers();
        
        super.login(this.config.Token);
    }
    handlingError() {
        process.on("unhandledRejection", info => console.error(info));
        process.on("uncaughtException", info => console.error(info));
        this.on("error", console.error);
        this.on("warn", console.warn);
    }
    async loadHandlers() {
        const start = await Date.now();
        const path = join(process.cwd(), "handlers");
        console.log("[Open]", path, "...");
        
        const handlers = readdirSync(path);
        for (const file of handlers) {
            require(join(path, file))(this);
        }
        
        console.log("[Closed]", path, `${Date.now()-start}ms`);
    }
}

module.exports = new MiruClient();