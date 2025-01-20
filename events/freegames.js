const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const client = require("../index.js");
const config = require('../config.js');

const freeGamesDataPath = path.resolve(__dirname, '../data/freegames.json');
const freeGamesChannelPath = path.resolve(__dirname, '../data/freegameschannel.json');

// Fonction pour récupérer les jeux gratuits depuis l'API
async function fetchFreeGame() {
    try {
        const response = await axios.get('https://api.protechnopolis.fr/free-epic-games');
        return response.data.currentGames[0];
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux gratuits:', error);
        return null;
    }
}

// Vérifier si le jeu a changé
async function checkForNewFreeGame() {
    const newGame = await fetchFreeGame();
    if (!newGame) return;

    let lastGame;
    try {
        lastGame = JSON.parse(fs.readFileSync(freeGamesDataPath, 'utf8'));
    } catch (err) {
        console.error(`Erreur lors du chargement de ${freeGamesDataPath}:`, err);
    }

    // Comparer le dernier jeu avec le nouveau
    if (!lastGame || lastGame.title !== newGame.title) {
        // Sauvegarder le nouveau jeu dans le fichier
        fs.writeFileSync(freeGamesDataPath, JSON.stringify(newGame, null, 2));

        // Créer l'embed avec EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle(newGame.title)
            .setDescription(`${newGame.title}\n\n**Prix:** GRATUIT\n> Expire dans <t:${Math.floor(new Date(newGame.endDate).getTime() / 1000)}:R>`)
            .setURL(newGame.productPage)
            .setColor(0x72c3ff) // Couleur bleue
            .setImage(newGame.image)
            .setThumbnail("https://i.imgur.com/6ZjdytV.png")
            .setFooter({ text: config.footer })
            .setTimestamp();

        // Charger les salons configurés pour afficher les jeux gratuits
        let freeGamesChannels;
        try {
            freeGamesChannels = JSON.parse(fs.readFileSync(freeGamesChannelPath, 'utf8'));
        } catch (err) {
            console.error(`Erreur lors du chargement de ${freeGamesChannelPath}:`, err);
        }

        if (freeGamesChannels) {
            // Envoyer le message dans chaque salon configuré
            for (const [serverId, channelId] of Object.entries(freeGamesChannels)) {
                const guild = await client.guilds.fetch(serverId);
                if (!guild) continue;

                const channel = await guild.channels.fetch(channelId);
                if (channel && channel.isTextBased()) {
                    channel.send({ embeds: [embed] }).catch(console.error);
                }
            }
        }
    }
}

// Vérifier chaque heure
setInterval(checkForNewFreeGame, 60 * 60 * 1000); // 1 heure

// Initialisation au démarrage du bot
client.once('ready', async () => {
    console.log(`${client.user.tag} est prêt et surveille les jeux gratuits !`);
    await checkForNewFreeGame(); // Vérifier immédiatement au démarrage
});
