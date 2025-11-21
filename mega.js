import mega from "megajs";

export async function upload(fileStream, fileName) {
    return new Promise((resolve, reject) => {
        const storage = mega({
            email: "Dosantosjotham@gmail.com",
            password: "Le28022008!"
        });

        storage.on("ready", () => {
            const file = storage.upload({ name: fileName }, fileStream);

            file.on("complete", () => {
                file.link((err, url) => {
                    if (err) reject(err);
                    else resolve(url);
                });
            });
        });

        storage.on("error", (err) => reject(err));
    });
}
