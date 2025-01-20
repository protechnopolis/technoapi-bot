const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "meme",
    description: "Génère un meme aléatoire.",
    run: async (client, interaction) => {
        try {
            const apiUrl = "https://api.protechnopolis.fr/meme";

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la récupération du meme : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();

            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "random-meme.png" });

            const embed = new EmbedBuilder()
                .setTitle("🎉 Meme random")
                .setDescription("Voici un meme généré aléatoirement pour vous :")
                .setColor("#aaff55")
                .setImage("attachment://random-meme.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande randommeme:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
