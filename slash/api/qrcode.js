const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "qrcode",
    description: "Génère un QR code pour un contenu donné.",
    options: [
        {
            name: "content",
            description: "Le contenu à inclure dans le QR code.",
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const content = interaction.options.getString("content");

        try {
            const apiUrl = `https://api.protechnopolis.fr/qrcode?content=${encodeURIComponent(content)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la génération du QR code : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const attachment = new AttachmentBuilder(buffer, { name: "qrcode.png" });

            const embed = new EmbedBuilder()
                .setTitle("🖇️ QR Code généré")
                .setDescription("Voici le QR code pour votre contenu.")
                .setColor("#0099ff")
                .setImage("attachment://qrcode.png")
                .setFooter({ text: "QR Code généré par protechnopolis" })
                .setTimestamp();

            interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande qrcode :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la génération du QR code.",
                ephemeral: true,
            });
        }
    },
};
