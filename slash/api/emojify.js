const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "emojify",
    description: "Transforme un texte en émojis.",
    options: [
        {
            name: "text",
            description: "Le texte à transformer en émojis.",
            type: 3, 
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
 
            const text = interaction.options.getString("text");


            const apiUrl = `https://api.protechnopolis.fr/emojify?text=${encodeURIComponent(text)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la transformation en émojis : ${response.statusText}`,
                    ephemeral: true
                });
            }

            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle("🎶 Emojify")
                .setDescription(`Voici votre texte transformé en émojis :`)
                .addFields(
                    { name: "Texte original", value: `\`\`\`${data.original}\`\`\`` },
                    { name: "Texte en émojis", value: `\`\`\`${data.emoji}\`\`\`` }
                )
                .setColor("#FF69B4")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande Emojify :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de l'exécution de la commande.",
                ephemeral: true
            });
        }
    },
};
