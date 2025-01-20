const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "chatgpt",
    description: "Interagit avec ChatGPT pour générer une réponse.",
    options: [
        {
            name: "text",
            description: "Le texte à envoyer à ChatGPT.",
            type: 3,
            required: true
        },
        {
            name: "mood",
            description: "L'humeur dans laquelle ChatGPT doit répondre.",
            type: 3,
            required: false,
            choices: [
                { name: "Chill", value: "chill" },
                { name: "Sérieux", value: "serieux" },
                { name: "Amusant", value: "amusant" }
            ]
        }
    ],
    run: async (client, interaction) => {
        try {
            const text = interaction.options.getString("text");
            const mood = interaction.options.getString("mood") || "chill";

            const apiUrl = "https://api.protechnopolis.fr/chatgpt";
            const body = { text, mood };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la communication avec ChatGPT : ${response.statusText}`,
                    ephemeral: true
                });
            }

            const data = await response.json();
            const reply = data.reply || "Aucune réponse reçue.";

            const embed = new EmbedBuilder()
                .setTitle("🤖 ChatGPT")
                .setColor("#5865F2")
                .setDescription(reply)
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande ChatGPT :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
