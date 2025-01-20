const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    name: "minecraft-achievement",
    description: "Génère un Achievement personnalisé pour Minecraft.",
    options: [
        {
            name: "text",
            description: "Le texte de l'achievement.",
            type: 3,
            required: true,
        },
        {
            name: "icon",
            description: "L'icône de l'achievement.",
            type: 3,
            required: true,
            choices: [
                { name: "Pomme", value: "apple" },
                { name: "Flèche", value: "arrow" },
                { name: "Lit", value: "bed" },
                { name: "Bedrock", value: "bedrock" },
                { name: "Poudre de Blaze", value: "blazePowder" },
                { name: "Bâton de Blaze", value: "blazeRod" },
                { name: "Bloc de Diamant", value: "blockOfDiamond" },
                { name: "Bloc d'Or", value: "blockOfGold" },
                { name: "Bloc de Fer", value: "blockOfIron" },
                { name: "Bateau", value: "boat" },
                { name: "Os", value: "bone" },
                { name: "Engrais", value: "bonemeal" },
                { name: "Livre", value: "book" },
                { name: "Bouteille d'Enchantement", value: "bottleOfEnchanting" },
                { name: "Bouteille", value: "bottle" },
                { name: "Arc", value: "bow" },
                { name: "Bol", value: "bowl" },
                { name: "Pain", value: "bread" },
                { name: "Brewstand", value: "brewingStand" },
                { name: "Seau", value: "bucket" },
            ],
        },
    ],
    run: async (client, interaction) => {
        try {
            const text = interaction.options.getString("text");
            const icon = interaction.options.getString("icon");

            const apiUrl = `https://api.protechnopolis.fr/mc-achievement?text=${encodeURIComponent(text)}&icon=${icon}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la génération de l'achievement : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const imageBuffer = await response.arrayBuffer();

            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "minecraft-achievement.png" });

            const embed = new EmbedBuilder()
                .setTitle("⛏ Minecraft Achievement")
                .setDescription(`Achievement généré avec l'icône **${icon.replace(/_/g, " ")}** !`)
                .setColor("#00FF00")
                .setImage("attachment://minecraft-achievement.png")
                .setFooter({ text: config.footer })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande Minecraft Achievement :", error);
            return interaction.reply({
                content: "Une erreur s'est produite lors de la génération de l'achievement.",
                ephemeral: true,
            });
        }
    },
};
