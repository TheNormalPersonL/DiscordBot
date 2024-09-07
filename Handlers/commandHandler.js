const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandFolders = ['Commands'];

    commandFolders.forEach(folder => {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../${folder}`)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, `../${folder}`, file));
            client.commands.set(command.name, command);
        }
    });
};
