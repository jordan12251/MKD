// mega.js
import mega from "megajs";
import fs from "fs";

// Infos du compte Mega
const email = 'Dosantosjotham@gmail.com';
const password = 'Le28022008!';

export async function uploadFile(filePath, fileName) {
    return new Promise((resolve, reject) => {
        const storage = mega({ email, password });
        
        storage.on('ready', () => {
            const file = storage.upload({ name: fileName }, filePath);
            
            file.on('complete', () => {
                file.link((err, url) => {
                    if (err) return reject(err);
                    resolve(url);
                });
            });
            
            file.on('error', (err) => {
                reject(err);
            });
        });

        storage.on('error', (err) => {
            reject(err);
        });
    });
}
