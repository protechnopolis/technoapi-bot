const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "joke",
    description: "Une petite blague ?",
    options: [
        {
            name: "type",
            description: "Type de blague à générer.",
            type: 3,
            required: true,
            choices: [
                { name: "Global", value: "global" },
                { name: "Dev", value: "dev" },
                { name: "Dark", value: "dark" },
                { name: "Limit", value: "limit" },
                { name: "Beauf", value: "beauf" },
                { name: "Blondes", value: "blondes" },
            ],
        },
    ],
    run: async (client, interaction) => {
        const type = interaction.options.getString("type");

        try {
            const apiUrl = `https://api.protechnopolis.fr/joke?type=${encodeURIComponent(type)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération de la blague : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            if (!data.joke || !data.answer) {
                return interaction.reply({
                    content: "Erreur : données de blague incomplètes reçues.",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`🎞️ Blague (${type.charAt(0).toUpperCase() + type.slice(1)})`)
                .setDescription(`${data.joke}\n\n**Réponse :** ${data.answer}`)
                .setColor("#FFAA00")
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande joke :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la récupération de la blague.",
                ephemeral: true,
            });
        }
    },
};
