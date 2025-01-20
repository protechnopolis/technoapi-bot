const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "weather",
    description: "Affiche les informations météorologiques pour une ville donnée.",
    options: [
        {
            name: "city",
            description: "Nom de la ville pour obtenir la météo.",
            type: 3, 
            required: true,
        },
        {
            name: "degree_type",
            description: "Type de degré (C ou F).",
            type: 3, 
            required: true,
            choices: [
                { name: "Celsius", value: "C" },
                { name: "Fahrenheit", value: "F" },
            ],
        },
    ],
    run: async (client, interaction) => {
        const city = interaction.options.getString("city");
        const degreeType = interaction.options.getString("degree_type");

        try {
            const apiUrl = `https://api.protechnopolis.fr/weather?city=${encodeURIComponent(city)}&degreeType=${degreeType}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération des données météorologiques : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            if (!data.city || !data.temperature || !data.skytext) {
                return interaction.reply({
                    content: "Erreur : données météorologiques incomplètes reçues.",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`🌦️ Météo pour ${data.city}`)
                .setDescription(`Voici les informations actuelles pour **${data.city}**.`)
                .addFields(
                    { name: "Température", value: `${data.temperature}°${degreeType}`, inline: true },
                    { name: "Conditions", value: `${data.skytext}`, inline: true },
                    { name: "Humidité", value: `${data.humidity}%`, inline: true },
                    { name: "Vent", value: `${data.wind}`, inline: true }
                )
                .setColor("#00AAFF")
                .setFooter({ text: "Informations météo fournies par protechnopolis" })
                .setTimestamp();

            if (data.forecast && Array.isArray(data.forecast)) {
                data.forecast.forEach((day) => {
                    embed.addFields({
                        name: `Prévisions pour ${day.day}`,
                        value: `🌡️ Max: ${day.high}°${degreeType}\n🌡️ Min: ${day.low}°${degreeType}\n☁️ ${day.sky}`,
                        inline: false,
                    });
                });
            }

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande weather :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la récupération des données météorologiques.",
                ephemeral: true,
            });
        }
    },
};
