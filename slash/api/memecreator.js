const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "memecreator",
    description: "Crée un meme personnalisé à partir d'un texte et d'un type.",
    options: [
        {
            name: "text",
            description: "Le texte à utiliser pour le meme.",
            type: 3,
            required: true
        },
        {
            name: "type",
            description: "Le type de meme à créer.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const text = interaction.options.getString("text");
            const type = interaction.options.getString("type");

            const apiUrl = `https://api.protechnopolis.fr/memecreator?text=${encodeURIComponent(text)}&type=${encodeURIComponent(type)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorResponse = await response.json();
                return interaction.reply({
                    content: `Erreur de l'API : ${errorResponse.message}`,
                    ephemeral: true
                });
            }

            const imageBuffer = await response.arrayBuffer();

            const attachment = {
                attachment: Buffer.from(imageBuffer),
                name: "meme.png"
            };

            const embed = new EmbedBuilder()
                .setTitle("😂 Création de Meme")
                .setDescription(`Voici votre meme personnalisé avec le texte : "${text}" et le type : "${type}".`)
                .setColor("#F5A623")
                .setImage("attachment://meme.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });

        } catch (error) {
            console.error("Erreur dans la commande memecreator :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
