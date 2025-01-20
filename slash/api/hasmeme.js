const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "hasmeme",
    description: "Crée un meme avec un texte personnalisé.",
    options: [
        {
            name: "customtext",
            description: "Le texte personnalisé pour le meme.",
            type: 3, // STRING type
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const customText = interaction.options.getString("customtext");
            const apiUrl = `https://api.protechnopolis.fr/hasmeme?customText=${encodeURIComponent(customText)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération du meme : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "has-meme.png" });

            const embed = new EmbedBuilder()
                .setTitle("🤔 Meme Has")
                .setDescription(`Voici un meme Has généré avec le texte personnalisé : **${customText}**`)
                .setColor("#55aaff")
                .setImage("attachment://has-meme.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande hasmeme:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
