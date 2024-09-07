// Loading the libraries here. The only reason I am using comments right now is the fact that I have to prove I know what is happening.
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: ['CHANNEL'] });

client.commands = new Collection(); // Creating a collection to store the bot commands here
client.events = new Collection(); // Creating a collection to store the bot events
client.prefix = "y!"; // The bots prefix

// Loading the handlers here
['commandHandler', 'eventHandler'].forEach(handler => {
    require(path.join(__dirname, 'Handlers', handler))(client);
  });

// Discord Bot Token here
client.login(process.env.TOKEN);