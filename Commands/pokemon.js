const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

// Colors for each Pokemon type
const typeColors = {
    normal: 0xA8A77A,
    fire: 0xEE8130,
    water: 0x6390F0,
    electric: 0xF7D02C,
    grass: 0x7AC74C,
    ice: 0x96D9D6,
    fighting: 0xC22E28,
    poison: 0xA33EA1,
    ground: 0xE2BF65,
    flying: 0xA98FF3,
    psychic: 0xF95587,
    bug: 0xA6B91A,
    rock: 0xB6A136,
    ghost: 0x735797,
    dragon: 0x6F35FC,
    dark: 0x705746,
    steel: 0xB7B7CE,
    fairy: 0xD685AD,
};

module.exports = {
    name: 'pokemon', // Command name
    description: 'Gets a random Pokemon lol', // Description of the command
    usage: 'l!pokemon', // Example of how to use the command
    
    async execute(message) {
        try {
            // Generates a random Pokemon ID between 1 and 1010
            const randomId = Math.floor(Math.random() * 1010) + 1;

            // Sends a request to the Pokemon API for data on the Pokémon with the random ID
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = response.data;

            // Function to capitalize the first letter of a string
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

            // Fetches the Pokemon's name, ID, types, abilities, stats, and sprite image
            const name = capitalize(data.name);
            const id = data.id;
            const types = data.types.map(typeInfo => capitalize(typeInfo.type.name));
            const abilities = data.abilities.map(abilityInfo => `**${capitalize(abilityInfo.ability.name)}**`).join('\n');
            const stats = data.stats.map(statInfo => `**${capitalize(statInfo.stat.name)}**: ${statInfo.base_stat}`).join('\n');
            const sprite = data.sprites.front_default;

            // Fetches species data, including the Pokemon's description from a different endpoint
            const speciesResponse = await axios.get(data.species.url);
            const speciesData = speciesResponse.data;
            // Finds the first English description of the Pokemon
            const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            // Cleans up the description
            const description = descriptionEntry ? `**${descriptionEntry.flavor_text.replace(/\n|\f/g, ' ')}**` : '**No description available.**';

            // Gets the color associated with the first type of the Pokemon
            const dominantType = types[0].toLowerCase();
            const color = typeColors[dominantType] || 0x1e90ff; // Defaults to a blue color if no type color is found

            // Creates an embed with all the Pokemon's data
            const embed = new EmbedBuilder()
                .setColor(color) // Sets the color of the embed
                .setTitle(`${name} (#${id})`) // Sets the title of the embed
                .setDescription(description) // Sets the description to the Pokemon's description
                .setThumbnail(sprite) // Sets the thumbnail to the Pokemon's sprite image
                .addFields(
                    { name: 'Type(s)', value: types.map(type => `**${type}**`).join('\n'), inline: true }, // Adds field for the Pokemon's type
                    { name: 'Abilities', value: abilities, inline: true }, // Adds field for the Pokemon's abilities
                    { name: 'Base Stats', value: stats, inline: false }, // Adds field for the Pokemon's base stats
                );

            // Sends the embed in the channel where the command was executed
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error); // Logs any error that occurs during the process
            // Sends an error message in the channel if something went wrong
            message.channel.send('Could not fetch data for a random Pokemon. Please try again.');
        }
    },
};
