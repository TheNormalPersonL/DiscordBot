module.exports = {
    name: 'messageCreate',
    execute(message) {
        const { client } = message;

        if (message.author.bot) return;

        if (!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) {
            console.log(`Command ${commandName} not found.`);
            return;
        }

        try {
            command.execute(message, args);
            console.log(`Executed command: ${commandName}`);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to execute that command.');
        }
    },
};
