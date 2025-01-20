const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "robloxgift",
    description: "Crée un faux cadeau Roblox avec les détails fournis.",
    options: [
        {
            name: "username",
            description: "Le nom d'utilisateur Roblox.",
            type: 3,
            required: true
        },
        {
            name: "avatar",
            description: "L'avatar de l'utilisateur Roblox.",
            type: 11,
            required: true
        },
        {
            name: "date",
            description: "La date du cadeau (ex: Mar 7, 2024).",
            type: 3,
            required: true
        },
        {
            name: "time",
            description: "L'heure du cadeau (ex: 18:32).",
            type: 3,
            required: true
        },
        {
            name: "amount",
            description: "Le montant du cadeau en Robux.",
            type: 4,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const username = interaction.options.getString("username");
            const avatar = interaction.options.getAttachment("avatar").url;
            const date = interaction.options.getString("date");
            const time = interaction.options.getString("time");
            const amount = interaction.options.getInteger("amount");

            const apiUrl = `https://api.protechnopolis.fr/roblox?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&amount=${amount}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la création du faux cadeau Roblox : ${response.statusText}`,
                    ephemeral: true
                });
            }

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                const giftImage = data.image || null;

                const embed = new EmbedBuilder()
                    .setTitle("🛍 Faux Cadeau Roblox")
                    .setColor("#FF8C00")
                    .setDescription("Voici le faux cadeau Roblox !")
                    .setFooter({ text: config.footer })
                    .setTimestamp();

                if (giftImage) {
                    embed.setImage(giftImage);
                }

                return interaction.reply({ embeds: [embed] });
            } else {
                const buffer = await response.arrayBuffer();
                const attachment = new AttachmentBuilder(Buffer.from(buffer), { name: 'gift.jpg' });

                const embed = new EmbedBuilder()
                    .setTitle("🛍 Faux Cadeau Roblox")
                    .setColor("#FF8C00")
                    .setDescription("Voici le faux cadeau Roblox !")
                    .setFooter({ text: config.footer })
                    .setTimestamp();

                embed.setImage("attachment://gift.jpg");

                return interaction.reply({ embeds: [embed], files: [attachment] });
            }
        } catch (error) {
            console.error("Erreur dans la commande Roblox Gift :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
