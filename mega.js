const mega = require("megajs");
const fs = require("fs");
const path = require("path");

// Identifiants MEGA
const email = "Dosantosjotham@gmail.com";
const password = "Le28022008!";

// Fonction pour uploader un fichier vers MEGA
async function uploadFileToMega(filePath) {
    return new Promise((resolve, reject) => {
        const storage = mega({ email, password });

        storage.on("ready", () => {
            const fileName = path.basename(filePath);

            const file = storage.upload(
                { name: fileName },
                fs.createReadStream(filePath)
            );

            file.on("complete", () => {
                file.link((err, url) => {
                    if (err) {
                        console.error("Erreur MEGA:", err);
                        reject(err);
                    } else {
                        console.log("Lien MEGA:", url);
                        resolve(url);
                    }
                });
            });
        });

        storage.on("error", (err) => {
            console.error("Erreur connexion MEGA:", err);
            reject(err);
        });
    });
}

module.exports = {
    uploadFileToMega
};
