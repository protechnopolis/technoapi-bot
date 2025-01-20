const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "fake-boost",
    description: "Crée une image de faux boosts pour un utilisateur.",
    options: [
        {
            name: "pseudo",
            description: "Le nom d'utilisateur pour le boost.",
            type: 3,
            required: true
        },
        {
            name: "amount",
            description: "Le nombre de boosts à afficher.",
            type: 4,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const pseudo = interaction.options.getString("pseudo");
            const amount = interaction.options.getInteger("amount");

            const apiUrl = `https://api.protechnopolis.fr/boost?pseudo=${encodeURIComponent(pseudo)}&repeat=${amount}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de l'image : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "fake-boost.png" });

            const embed = new EmbedBuilder()
                .setTitle("Fake Boost")
                .setDescription(`Voici l'image générée pour l'utilisateur **${pseudo}** avec **${amount}** boosts.`)
                .setColor("#f542ef")
                .setImage("attachment://fake-boost.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande fake-boost:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
