const { join } = require("node:path");
const structurePath = join(process.cwd(), "structures");
const CommandInterface = require(join(structurePath, "CommandInterface"));
const { inspect } = require("node:util");

module.exports = new CommandInterface({
    data: {
        type: 1,
        name: "eval",
        description: "Executes javascript code"
    },
    private: true,
    async execute(i) {
        await i.deferReply();
        
        var code = i.args.join(" ");
        if (!code) code = "new (class Code { constructor() { this.required = true } })()";
        
        const embed = new i.EmbedBuilder();
        
        try {
            await generate(i, code, embed);
        }
        catch(error) {
            await failed(i, embed, error);
        }
    }
});

async function generate(i, code, embed) {
    let evaled = await eval(code);
    
    evaled = clean(evaled);
    
    embed.setColor("Green")
        .setTitle("Result")
        .setDescription(`\`\`\`js\n${evaled}\`\`\``);
    
    await i.editReply({embeds: [embed] });
    return;
}

async function failed(i, embed, error) {
    embed.setColor("Red")
        .setTitle("Failed")
        .setDescription(`\`\`\`js\n${clean(error)}\`\`\``);
    
    await i.editReply({embeds: [embed] });
    return;
}

function clean(code) {
    if  (typeof code === "string") {
        return code
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else {
        return inspect(code, { depth: 0 });
    }
};