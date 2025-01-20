const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "nothingmeme",
    description: "Crée un meme personnalisé avec le texte 'nothing'.",
    options: [
        {
            name: "text",
            description: "Le texte à inclure dans le meme.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const text = interaction.options.getString("text");

            const apiUrl = `https://api.protechnopolis.fr/nothingmeme?text=${encodeURIComponent(text)}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération du meme : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();

            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "nothing-meme.png" });

            const embed = new EmbedBuilder()
                .setTitle("😆 Meme 'nothing' personnalisé")
                .setDescription(`Voici votre meme personnalisé avec le texte : **${text}**`)
                .setColor("#00bfff")
                .setImage("attachment://nothing-meme.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande nothingmeme:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
