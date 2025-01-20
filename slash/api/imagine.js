const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "imagine",
    description: "Génère une image à partir d'un texte donné.",
    options: [
        {
            name: "text",
            description: "Le texte pour générer l'image.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const text = interaction.options.getString("text");

        const embed = new EmbedBuilder()
            .setTitle("🖼️ Génération d'image")
            .setDescription(`Génération de l'image à partir du texte : "${text}"...`)
            .setColor("#5865F2")
            .setFooter({ text: config.footer })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        try {
            const apiUrl = `https://api.protechnopolis.fr/imagine?text=${encodeURIComponent(text)}&link=false`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return message.edit({
                    content: `Erreur lors de la génération de l'image : ${response.statusText}`,
                    embeds: []
                });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = {
                attachment: Buffer.from(imageBuffer),
                name: "generated-image.png"
            };

            const updatedEmbed = new EmbedBuilder()
                .setTitle("🖼️ Image générée")
                .setDescription(`Voici l'image générée à partir du texte : "${text}"`)
                .setColor("#5865F2")
                .setImage("attachment://generated-image.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return message.edit({ embeds: [updatedEmbed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande Imagine :", error);
            return message.edit({
                content: "Une erreur s'est produite lors de la génération de l'image.",
                embeds: []
            });
        }
    },
};
