const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require('../../config.js');

module.exports = {
    name: "banner",
    description: "Génère une bannière personnalisée avec un texte et une image de fond.",
    options: [
        {
            name: "background",
            description: "URL de l'image de fond pour la bannière.",
            type: 3, 
            required: true
        },
        {
            name: "text",
            description: "Le texte à afficher sur la bannière.",
            type: 3, 
            required: true
        },
        {
            name: "height",
            description: "Hauteur de la bannière (en pixels).",
            type: 4, 
            required: false
        },
        {
            name: "width",
            description: "Largeur de la bannière (en pixels).",
            type: 4, 
            required: false
        }
    ],
    run: async (client, interaction) => {
        try {

            const background = interaction.options.getString("background");
            const text = interaction.options.getString("text");
            const height = interaction.options.getInteger("height") || 240; 
            const width = interaction.options.getInteger("width") || 600;  

            
            const apiUrl = `https://api.protechnopolis.fr/banner?background=${encodeURIComponent(background)}&text=${encodeURIComponent(text)}&height=${height}&width=${width}`;

            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                return interaction.reply({ content: `Erreur lors de la génération de la bannière : ${response.statusText}`, ephemeral: true });
            }

            
            const imageBuffer = await response.arrayBuffer();

            
            const attachment = new AttachmentBuilder(Buffer.from(imageBuffer), { name: "custom-banner.png" });

            
            const embed = new EmbedBuilder()
                .setTitle("🎨 Bannière personnalisée")
                .setDescription(`Voici la bannière générée avec le texte **${text}**.`)
                .setColor("#00aaff")
                .setImage("attachment://custom-banner.png") 
                .setFooter({ text: config.footer })
                .setTimestamp();

         
            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error("Erreur dans la commande banner:", error);
            return interaction.reply({ content: "Une erreur s'est produite lors de l'exécution de la commande.", ephemeral: true });
        }
    },
};
