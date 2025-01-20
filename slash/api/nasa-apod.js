const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "nasa-apod",
    description: "Affiche la photo astronomique du jour de la NASA en HD.",
    run: async (client, interaction) => {
        try {
            const apiUrl = "https://api.protechnopolis.fr/nasa-apod";

            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération de la photo astronomique : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(`🌌 NASA Astronomy Picture Of the Day - ${data.title}`)
                .setDescription(data.explanation || "Pas de description disponible.")
                .setColor("#1E90FF")
                .setImage(data.hdurl)
                .setFooter({ text: data.copyright ? `© ${data.copyright.trim()} | technoAPI` : "technoAPI" })
                .setTimestamp(new Date(data.date));

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande NASA-APOD :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de la récupération de la photo astronomique.",
                ephemeral: true,
            });
        }
    },
};
