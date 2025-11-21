import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mega = require("megajs");
import fs from "fs";

/**
 * Upload sur Mega
 * @param {fs.ReadStream} fileStream 
 * @param {string} name 
 * @returns {Promise<string>} Lien du fichier
 */
export function uploadFile(fileStream, name) {
  return new Promise((resolve, reject) => {
    const storage = mega({
      email: "Dosantosjotham@gmail.com",
      password: "Le28022008!"
    });

    storage.on("ready", () => {
      const file = storage.upload({ name }, fileStream);

      file.on("complete", () => {
        file.link((err, url) => {
          if (err) return reject(err);
          resolve(url);
        });
      });

      file.on("error", (err) => reject(err));
    });

    storage.on("error", (err) => reject(err));
  });
}
