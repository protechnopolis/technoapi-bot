const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hash",
    description: "Transforme un texte en hash.",
    options: [
        {
            name: "text",
            description: "Le texte à transformer en hash.",
            type: 3, // String
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const text = interaction.options.getString("text");

        try {
            const apiUrl = `https://api.protechnopolis.fr/hash?text=${encodeURIComponent(text)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la génération du hash : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle("🔐 Hasheur De Textes")
                .setDescription("Voici le hash généré pour votre texte.")
                .addFields(
                    { name: "Texte original", value: `\`${text}\`` },
                    { name: "Hash", value: `\`${data.hash}\`` }
                )
                .setColor("#0099ff")
                .setFooter({ text: "Hash généré par protechnopolis" })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande hash :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la génération du hash.",
                ephemeral: true,
            });
        }
    },
};
