const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ipinfo",
    description: "Affiche des informations sur une adresse IP donnée.",
    options: [
        {
            name: "ip",
            description: "Adresse IP pour laquelle afficher les informations.",
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const ip = interaction.options.getString("ip");

        try {
            const apiUrl = `https://api.protechnopolis.fr/ipinfo?ip=${encodeURIComponent(ip)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération des informations IP : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            if (!data.ip || !data.country || !data.loc) {
                return interaction.reply({
                    content: "Erreur : données IP incomplètes reçues.",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`📍 Informations IP pour ${data.ip}`)
                .setDescription("Voici les informations récupérées pour l'adresse IP donnée :")
                .addFields(
                    { name: "IP", value: data.ip, inline: true },
                    { name: "Hostname", value: data.hostname || "Non disponible", inline: true },
                    { name: "Ville", value: data.city || "Non disponible", inline: true },
                    { name: "Région", value: data.region || "Non disponible", inline: true },
                    { name: "Pays", value: data.country || "Non disponible", inline: true },
                    { name: "Organisation", value: data.org || "Non disponible", inline: true },
                    { name: "Code Postal", value: data.postal || "Non disponible", inline: true },
                    { name: "Fuseau Horaire", value: data.timezone || "Non disponible", inline: true },
                    { name: "Localisation", value: data.loc || "Non disponible", inline: true },
                    { name: "Anycast", value: data.anycast ? "Oui" : "Non", inline: true }
                )
                .setColor("#00AAFF")
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande ipinfo :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la récupération des informations IP.",
                ephemeral: true,
            });
        }
    },
};
