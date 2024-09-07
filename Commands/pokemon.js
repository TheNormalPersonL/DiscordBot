const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

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
    name: 'pokemon',
    description: 'Gets detailed information about a random Pokémon',
    usage: 'l!pokemon',
    
    async execute(message) {
        try {
            const randomId = Math.floor(Math.random() * 1010) + 1;

            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = response.data;

            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

            const name = capitalize(data.name);
            const id = data.id;
            const types = data.types.map(typeInfo => capitalize(typeInfo.type.name));
            const abilities = data.abilities.map(abilityInfo => `**${capitalize(abilityInfo.ability.name)}**`).join('\n');
            const stats = data.stats.map(statInfo => `**${capitalize(statInfo.stat.name)}**: ${statInfo.base_stat}`).join('\n');
            const sprite = data.sprites.front_default;

            const speciesResponse = await axios.get(data.species.url);
            const speciesData = speciesResponse.data;
            const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            const description = descriptionEntry ? `**${descriptionEntry.flavor_text.replace(/\n|\f/g, ' ')}**` : '**No description available.**';

            const dominantType = types[0].toLowerCase();
            const color = typeColors[dominantType] || 0x1e90ff;

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${name} (#${id})`)
                .setDescription(description)
                .setThumbnail(sprite)
                .addFields(
                    { name: 'Type(s)', value: types.map(type => `**${type}**`).join('\n'), inline: true },
                    { name: 'Abilities', value: abilities, inline: true },
                    { name: 'Base Stats', value: stats, inline: false },
                )

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send('Could not fetch data for a random Pokémon. Please try again.');
        }
    },
};
