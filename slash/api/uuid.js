const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "uuid",
    description: "Génère un UUID unique.",
    run: async (client, interaction) => {
        try {
            const apiUrl = "https://api.protechnopolis.fr/uuid";
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la génération de l'UUID : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            if (!data.uuid) {
                return interaction.reply({
                    content: "Erreur : aucun UUID n'a été retourné par l'API.",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle("🆔 Générateur UUID")
                .setDescription(`Voici votre UUID généré : \`${data.uuid}\``)
                .setColor("#00AAFF")
                .setFooter({
                    text: "UUID généré avec succès.",
                })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande uuid :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la génération de l'UUID.",
                ephemeral: true,
            });
        }
    },
};
