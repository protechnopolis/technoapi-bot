const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "fake-tiktok-ban",
    description: "Crée un faux ban de compte TikTok.",
    options: [
        {
            name: "username",
            description: "Le nom d'utilisateur du compte TikTok.",
            type: 3,
            required: true
        },
        {
            name: "followers",
            description: "Le nombre de followers du compte.",
            type: 4,
            required: true
        },
        {
            name: "following",
            description: "Le nombre d'abonnements du compte.",
            type: 4,
            required: true
        },
        {
            name: "likes",
            description: "Le nombre de likes du compte.",
            type: 4,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const username = interaction.options.getString("username");
            const followers = interaction.options.getInteger("followers");
            const following = interaction.options.getInteger("following");
            const likes = interaction.options.getInteger("likes");

            const apiUrl = `https://api.protechnopolis.fr/tiktok?username=${encodeURIComponent(username)}&followers=${followers}&following=${following}&likes=${likes}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de l'image : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.arrayBuffer();
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "fake-tiktok-ban.png" });

            const embed = new EmbedBuilder()
                .setTitle("🚫 Faux ban de compte TikTok")
                .setDescription(
                    `Voici une image simulant le faux ban du compte TikTok :\n\n**Nom d'utilisateur :** ${username}\n**Followers :** ${followers}\n**Abonnements :** ${following}\n**Likes :** ${likes}`
                )
                .setColor("#ff5555")
                .setImage("attachment://fake-tiktok-ban.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande faketiktokban:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
