const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "screenshot",
    description: "Prend une capture d'écran d'un site web.",
    options: [
        {
            name: "url",
            description: "L'URL du site web dont vous souhaitez prendre une capture d'écran.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const url = interaction.options.getString("url");

        const embed = new EmbedBuilder()
            .setTitle("📷 Capture d'écran Site Web")
            .setDescription(`Prise de la capture d'écran pour : ${url}...`)
            .setColor("#FF4500")
            .setFooter({ text: config.footer })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        try {
            const apiUrl = `https://api.protechnopolis.fr/screenshot?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return message.edit({
                    content: `Erreur lors de la prise de la capture d'écran : ${response.statusText}`,
                    embeds: []
                });
            }

            const screenshotBuffer = await response.arrayBuffer();
            const attachment = {
                attachment: Buffer.from(screenshotBuffer),
                name: "screenshot.png"
            };

            const updatedEmbed = new EmbedBuilder()
                .setTitle("📷 Capture d'écran du Site Web")
                .setDescription(`Voici la capture d'écran du site : ${url}`)
                .setColor("#FF4500")
                .setImage("attachment://screenshot.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return message.edit({ embeds: [updatedEmbed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande Screenshot :", error);
            return message.edit({
                content: "Une erreur s'est produite lors de la prise de la capture d'écran.",
                embeds: []
            });
        }
    },
};
