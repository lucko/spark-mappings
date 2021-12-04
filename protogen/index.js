const Pbf = require('pbf');
const fs = require('fs');
const {
    BukkitMappings,
    McpMappings,
    YarnMappings,
    MojangMappings
} = require('./protos');

const versions = fs.readdirSync('../dist/').filter(name => /^\d+_\d+(_\d+)?$/.test(name));

for (const version of versions) {
    const files = fs.readdirSync(`../dist/${version}/`).filter(name => name.endsWith('.json'));

    for (const file of files) {
        console.log('converting: ' + version + ' -> ' + file);

        const json = require(`../dist/${version}/${file}`);
        const writer = new Pbf();

        if (file === 'bukkit.json') {
            for (const cl of Object.values(json.classes)) {
                for (const m of cl.methods) {
                    m.mapped = m.bukkitName;
                }
            }

            BukkitMappings.write(json, writer);
        } else if (file === 'mcp.json') {
            for (const cl of Object.values(json.classes)) {
                for (const m of cl.methods) {
                    m.mapped = m.mcpName;
                    m.intermediate = m.seargeName;
                }
            }

            McpMappings.write(json, writer);
        } else if (file === 'yarn.json') {
            YarnMappings.write(json, writer);
        } else if (file === 'mojang.json') {
            for (const cl of Object.values(json.classes)) {
                for (const m of cl.methods) {
                    m.mapped = m.mojangName;
                }
            }

            MojangMappings.write(json, writer);
        } else {
            console.warn('unknown file/type: ' + version + '/' + file);
            continue;
        }

        const buffer = writer.finish();

        const outputFile = `../dist/${version}/${file.slice(0, -5)}.wasm`;
        fs.writeFile(outputFile, buffer, 'utf8', () => {});
    }
}
