const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "free-epic-games",
    description: "Affiche les jeux gratuits Epic Games du moment.",
    run: async (client, interaction) => {
        try {
            const apiUrl = "https://api.protechnopolis.fr/free-epic-games";
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération des jeux gratuits Epic Games : ${response.statusText}`,
                    ephemeral: true
                });
            }

            const data = await response.json();

            if (!data.currentGames || data.currentGames.length === 0) {
                return interaction.reply({
                    content: "Aucun jeu gratuit Epic Games disponible pour le moment.",
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle("🆓 Jeux gratuits Epic Games")
                .setColor("#FF6F61")
                .setFooter({ text: config.footer })
                .setTimestamp();

            data.currentGames.forEach(game => {
                embed.addFields(
                    { name: game.title, value: game.description || "Aucune description", inline: false },
                    { name: "Dates", value: `Du ${new Date(game.startDate).toLocaleString()} au ${new Date(game.endDate).toLocaleString()}`, inline: false },
                    { name: "Page produit", value: `[Voir le jeu](${game.productPage})`, inline: false }
                );

                if (game.image) {
                    embed.setImage(game.image);
                }
            });

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande FreeEpicGames :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
