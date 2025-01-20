const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "couple-create",
    description: "Crée une image personnalisée pour un couple.",
    options: [
        {
            name: "user1",
            description: "Le premier utilisateur (mention ou ID Discord).",
            type: 6,
            required: true
        },
        {
            name: "user2",
            description: "Le deuxième utilisateur (mention ou ID Discord).",
            type: 6,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const user1 = interaction.options.getUser("user1");
            const user2 = interaction.options.getUser("user2");

            const apiUrl = `https://api.protechnopolis.fr/couple?user1=${user1.id}&user2=${user2.id}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de l'image : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "couple-image.png" });

            const embed = new EmbedBuilder()
                .setTitle("💑 Couple: Image personnalisée")
                .setDescription(`Voici une image personnalisée pour le couple :\n\n**${user1.username}** ❤️ **${user2.username}**`)
                .setColor("#ff66cc")
                .setImage("attachment://couple-image.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande couple:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
