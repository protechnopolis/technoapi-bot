const { EmbedBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "blacklist",
    description: "Vérifie si un utilisateur est dans la liste noire.",
    options: [
        {
            name: "id",
            description: "L'ID de l'utilisateur à vérifier.",
            type: 3, 
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            const id = interaction.options.getString("id");
            const apiUrl = `https://api.protechnopolis.fr/blacklist?id=${encodeURIComponent(id)}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ 
                    content: `❌ Erreur lors de la vérification : ${response.statusText}`, 
                    ephemeral: true 
                });
            }

            const data = await response.json();
            const isBlacklisted = data.blacklisted;
            const reason = data.reason || "Non spécifiée";
            const dateNow = `<t:${Math.floor(Date.now() / 1000)}:F>`; // Date actuelle au format Discord

            const embed = new EmbedBuilder()
                .setTitle("🚫 Vérification Blacklist")
                .setColor(isBlacklisted ? "#ff0000" : "#00ff00")
                .setDescription(
                    isBlacklisted
                        ? `🔴 **L'utilisateur avec l'ID** \`${id}\` **est dans la liste noire.**\n\n📌 **Raison :** ${reason}\n📅 **Date de vérification :** ${dateNow}`
                        : `🟢 **L'utilisateur avec l'ID** \`${id}\` **n'est pas dans la liste noire.**\n📅 **Date de vérification :** ${dateNow}`
                )
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur dans la commande blacklist:", error);
            return interaction.reply({ 
                content: "❌ Une erreur s'est produite lors de l'exécution de la commande.", 
                ephemeral: true 
            });
        }
    },
};
