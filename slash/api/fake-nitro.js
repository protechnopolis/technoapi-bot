const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "fake-nitro",
    description: "Génère un message de faux Nitro.",
    options: [
        {
            name: "sender",
            description: "ID de l'expéditeur du message.",
            type: 6,
            required: true
        },
        {
            name: "responder",
            description: "ID du destinataire du message.",
            type: 6,
            required: true
        },
        {
            name: "sender_message",
            description: "Message de l'expéditeur.",
            type: 3,
            required: true
        },
        {
            name: "responder_message",
            description: "Message du destinataire.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const senderId = interaction.options.getUser("sender").id;
        const responderId = interaction.options.getUser("responder").id;
        const senderMessage = interaction.options.getString("sender_message");
        const responderMessage = interaction.options.getString("responder_message");

        const apiUrl = `https://api.protechnopolis.fr/nitro?senderId=${senderId}&responderId=${responderId}&senderMessage=${encodeURIComponent(senderMessage)}&responderMessage=${encodeURIComponent(responderMessage)}`;

        try {
            const embed = new EmbedBuilder()
                .setTitle("Fake Nitro")
                .setImage(apiUrl)
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "Une erreur s'est produite lors de la génération du message de faux Nitro. Veuillez réessayer plus tard.", ephemeral: true });
        }
    },
};
