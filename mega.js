const mega = require('megajs');

// Infos du compte Mega
let email = 'Dosantosjotham@gmail.com';
let password = 'Le28022008!';

// Connexion au compte Mega
const storage = mega({ email, password });

// Fonction pour uploader un fichier
function uploadFile(filePath) {
    storage.on('ready', () => {
        const file = storage.upload({ name: filePath.split('/').pop() }, filePath);
        file.on('complete', () => {
            file.link((err, url) => {
                if (err) {
                    console.error('Erreur génération du lien:', err);
                } else {
                    console.log('Lien du fichier:', url);
                }
            });
        });
    });
}

// Exemple : uploader un fichier nommé 'document.txt'
uploadFile('document.txt');
