const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "createpaste",
    description: "Crée un lien Paste.ee avec un titre et un contenu personnalisé.",
    options: [
        {
            name: "title",
            description: "Le titre du paste.",
            type: 3,
            required: true
        },
        {
            name: "content",
            description: "Le contenu du paste.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const title = interaction.options.getString("title");
            const content = interaction.options.getString("content");

            const apiUrl = "https://api.protechnopolis.fr/create-paste";
            const params = new URLSearchParams();
            params.append("title", title);
            params.append("content", content);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            });

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la création du paste : ${response.statusText}`,
                    ephemeral: true
                });
            }

            const data = await response.json();

            // Log la réponse de l'API dans la console
            console.log("Réponse de l'API :", data);

            if (data.message === "Paste créé avec succès.") {
                const embed = new EmbedBuilder()
                    .setTitle("📋 Lien Paste créé")
                    .setDescription("Votre paste a été créé avec succès !")
                    .addFields(
                        { name: "Titre", value: title },
                        { name: "Contenu", value: content },
                        { name: "Lien Paste", value: `[Cliquez ici pour accéder au paste](${data.pasteUrl})` }
                    )
                    .setColor("#32CD32")
                    .setFooter({ text: config.footer })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply({
                    content: "Une erreur s'est produite lors de la création du paste.",
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error("Erreur dans la commande CreatePaste :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
