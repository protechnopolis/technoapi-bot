const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot et génère une image de latence.",
    run: async (client, interaction) => {
        try {
            const botLatency = Math.round(client.ws.ping);

            const apiUrl = `https://api.protechnopolis.fr/ping?ping=${botLatency}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de l'image : ${response.statusText}`, ephemeral: true });
            }

            const imageBuffer = await response.buffer();

            const attachment = {
                attachment: imageBuffer,
                name: "ping_image.png"
            };

            const embed = new EmbedBuilder()
                .setTitle("📡 Latence du Bot")
                .setDescription(`La latence du bot est de **${botLatency}ms**.`)
                .setColor("#00FF00")
                .setImage("attachment://ping_image.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });

        } catch (error) {
            console.error("Erreur dans la commande ping :", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
