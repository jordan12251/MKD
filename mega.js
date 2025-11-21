// mega.js
import * as mega from "megajs";

// Infos du compte MEGA
const email = 'Dosantosjotham@gmail.com';
const password = 'Le28022008!';

/**
 * Upload un fichier sur MEGA
 * @param {ReadableStream|string} fileStream - Stream du fichier ou chemin local
 * @param {string} fileName - Nom du fichier à créer sur MEGA
 * @returns {Promise<string>} - Lien du fichier MEGA
 */
export async function upload(fileStream, fileName) {
    return new Promise((resolve, reject) => {
        const storage = mega.default ? mega.default({ email, password }) : mega({ email, password });

        storage.on('ready', () => {
            const file = storage.upload({ name: fileName }, fileStream);

            file.on('complete', () => {
                file.link((err, url) => {
                    if (err) {
                        console.error('Erreur génération du lien MEGA:', err);
                        reject(err);
                    } else {
                        console.log('Lien du fichier MEGA:', url);
                        resolve(url);
                    }
                });
            });

            file.on('error', (err) => {
                console.error('Erreur lors de l\'upload MEGA:', err);
                reject(err);
            });
        });

        storage.on('error', (err) => {
            console.error('Erreur connexion MEGA:', err);
            reject(err);
        });
    });
}
