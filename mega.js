// mega.js
import mega from "megajs";

// Infos du compte Mega
const email = 'Dosantosjotham@gmail.com';
const password = 'Le28022008!';

// Connexion au compte Mega
const storage = mega({ email, password });

/**
 * Fonction pour uploader un fichier sur Mega et récupérer le lien
 * @param {ReadableStream|Buffer|String} fileStream - Le fichier ou chemin du fichier à uploader
 * @param {String} fileName - Nom du fichier sur Mega
 * @returns {Promise<String>} - Retourne l'URL du fichier
 */
export async function upload(fileStream, fileName) {
    return new Promise((resolve, reject) => {
        storage.on('ready', () => {
            const file = storage.upload({ name: fileName }, fileStream);

            file.on('complete', () => {
                file.link((err, url) => {
                    if (err) {
                        console.error('Erreur génération du lien:', err);
                        reject(err);
                    } else {
                        console.log('Lien du fichier:', url);
                        resolve(url);
                    }
                });
            });

            file.on('error', (err) => {
                console.error('Erreur upload Mega:', err);
                reject(err);
            });
        });

        storage.on('error', (err) => {
            console.error('Erreur connexion Mega:', err);
            reject(err);
        });
    });
}
