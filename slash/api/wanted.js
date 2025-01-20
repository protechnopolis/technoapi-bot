const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "wanted",
    description: "Crée une image Wanted personnalisée pour un utilisateur.",
    options: [
        {
            name: "user",
            description: "L'utilisateur pour lequel créer l'image (mention ou ID Discord).",
            type: 6, 
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const user = interaction.options.getUser("user");

            const apiUrl = `https://api.protechnopolis.fr/wanted?user=${user.id}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de l'image : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();

            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "wanted-image.png" });

            const embed = new EmbedBuilder()
                .setTitle("🔍 Image Wanted personnalisée")
                .setDescription(`Voici une image Wanted pour **${user.username}** !`)
                .setColor("#ffcc00")
                .setImage("attachment://wanted-image.png") 
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande wanted:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
