const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "fake-paypal",
    description: "Génère une image de faux paiement PayPal.",
    options: [
        {
            name: "user",
            description: "Nom de l'utilisateur pour le paiement.",
            type: 3,
            required: true
        },
        {
            name: "amount",
            description: "Montant du paiement.",
            type: 4,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getString("user");
        const amount = interaction.options.getInteger("amount");

        const apiUrl = `https://api.protechnopolis.fr/paypal?user=${encodeURIComponent(user)}&amount=${amount}`;

        try {
            const embed = new EmbedBuilder()
                .setTitle("Fake PayPal Payment")
                .setDescription(`**Utilisateur :** ${user}\n**Montant :** $${amount}`)
                .setImage(apiUrl)
                .setColor("#009CDE")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "Une erreur s'est produite lors de la génération de l'image de faux paiement PayPal. Veuillez réessayer plus tard.", ephemeral: true });
        }
    },
};
