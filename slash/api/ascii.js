const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ascii",
    description: "Transforme un texte en ASCII.",
    options: [
        {
            name: "text",
            description: "Le texte à transformer en ASCII.",
            type: 3, 
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const text = interaction.options.getString("text");

        try {

            const apiUrl = `https://api.protechnopolis.fr/ascii?text=${encodeURIComponent(text)}`;


            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la génération de l'ASCII : ${response.statusText}`,
                    ephemeral: true,
                });
            }


            const data = await response.json();


            const embed = new EmbedBuilder()
                .setTitle("🎨 Ascii Converter")
                .setDescription("Voici votre texte transformé en ASCII :")
                .addFields(
                    { name: "Texte original", value: `\`${text}\`` },
                    { name: "ASCII", value: `\`\`\`\n${data.ascii}\n\`\`\`` }
                )
                .setColor("#00ff99")
                .setFooter({ text: "ASCII généré par protechnopolis" })
                .setTimestamp();


            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande ASCII :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la génération de l'ASCII.",
                ephemeral: true,
            });
        }
    },
};
