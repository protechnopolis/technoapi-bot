const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "fake-message",
    description: "Crée une image avec un message personnalisé pour un utilisateur.",
    options: [
        {
            name: "user",
            description: "L'utilisateur pour lequel créer le message.",
            type: 6,
            required: true
        },
        {
            name: "message",
            description: "Le message personnalisé à afficher.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getUser("user");
        const message = interaction.options.getString("message");
        const userId = user.id;

        const apiUrl = `https://api.protechnopolis.fr/custom_msg?id=${userId}&message=${encodeURIComponent(message)}`;

        const embed = new EmbedBuilder()
            .setTitle("Fake Message")
            .setDescription(`Voici une image générée pour **${user.username}** avec le message personnalisé.`)
            .setImage(apiUrl)
            .setFooter({ text: config.footer })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
