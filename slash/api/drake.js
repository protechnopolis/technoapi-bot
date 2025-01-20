const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "drake",
    description: "Crée un meme de type Drake avec des choix personnalisés.",
    options: [
        {
            name: "textyes",
            description: "Texte pour le choix positif (Drake aime).",
            type: 3,
            required: true
        },
        {
            name: "textno",
            description: "Texte pour le choix négatif (Drake n'aime pas).",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const textYes = interaction.options.getString("textyes");
            const textNo = interaction.options.getString("textno");

            const apiUrl = `https://api.protechnopolis.fr/drake?textYes=${encodeURIComponent(textYes)}&textNo=${encodeURIComponent(textNo)}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération du meme : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "drake-meme.png" });

            const embed = new EmbedBuilder()
                .setTitle("🎤 Meme Drake personnalisé")
                .setDescription(`Voici un meme Drake généré avec vos choix :`)
                .setColor("#ffaa00")
                .setImage("attachment://drake-meme.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande drake:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
