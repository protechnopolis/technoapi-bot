const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "repo-info",
    description: "Affiche des informations sur un repository GitHub.",
    options: [
        {
            name: "repo",
            description: "Lien du repository GitHub.",
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const repoUrl = interaction.options.getString("repo");

        try {
            if (!repoUrl.startsWith("https://github.com/")) {
                return interaction.reply({
                    content: "Veuillez fournir un lien valide vers un repository GitHub.",
                    ephemeral: true,
                });
            }

            const apiUrl = `https://api.protechnopolis.fr/repo-info?repo=${encodeURIComponent(repoUrl)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return interaction.reply({
                    content: `Erreur lors de la récupération des informations : ${response.statusText}`,
                    ephemeral: true,
                });
            }

            const data = await response.json();

            let fileTreeContent = data.file_tree;
            let fileTreeFile = null;

            if (fileTreeContent.length > 1024) {
                const tempFilePath = path.join(__dirname, `filetree_${Date.now()}.txt`);
                fs.writeFileSync(tempFilePath, fileTreeContent);
                fileTreeFile = tempFilePath;
                fileTreeContent = "Le file tree est trop grand, un fichier a été généré et est attaché ci-dessous.";
            }

            const embed = new EmbedBuilder()
                .setTitle(`🐈 Informations sur le repository : ${data.name}`)
                .setURL(data.url)
                .setDescription(data.description || "Pas de description.")
                .setColor("#4078C0")
                .setThumbnail(data.owner.avatar_url)
                .addFields(
                    { name: "Propriétaire", value: `[${data.owner.login}](${data.owner.html_url}) (${data.owner.type})`, inline: true },
                    { name: "Langage", value: data.language || "Inconnu", inline: true },
                    { name: "Licence", value: data.license || "Non spécifiée", inline: true },
                    { name: "Stars", value: `${data.stars}`, inline: true },
                    { name: "Forks", value: `${data.forks}`, inline: true },
                    { name: "Watchers", value: `${data.watchers}`, inline: true },
                    { name: "Problèmes ouverts", value: `${data.open_issues}`, inline: true },
                    { name: "Branche par défaut", value: data.default_branch, inline: true },
                    { name: "Dernière mise à jour", value: `<t:${Math.floor(new Date(data.updated_at).getTime() / 1000)}:R>`, inline: true },
                    { name: "File Tree", value: fileTreeContent },
                )
                .setFooter({
                    text: `Créé le : ${new Date(data.created_at).toLocaleDateString()}`,
                })
                .setAuthor({
                    name: `GitHub - ${data.owner.login}`,
                    iconURL: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
                    url: data.owner.html_url,
                });

            if (fileTreeFile) {
                await interaction.reply({
                    embeds: [embed],
                    files: [{
                        attachment: fileTreeFile,
                        name: `filetree_${Date.now()}.txt`
                    }]
                });

                fs.unlinkSync(fileTreeFile);
            } else {
                await interaction.reply({
                    embeds: [embed]
                });
            }
        } catch (error) {
            console.error("Erreur dans la commande repo-info :", error);
            interaction.reply({
                content: "Une erreur s'est produite lors de la récupération des informations du repository.",
                ephemeral: true,
            });
        }
    },
};
