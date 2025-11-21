import { makeid } from "./gen-id.js";
import express from "express";
import fs from "fs";
import pino from "pino";

import {
    default as makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";

import { upload } from "./mega.js";

const router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function MALVIN_XD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

        try {
            // Browser random
            const items = ["Safari"];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: "fatal" }).child({ level: "fatal" })
                    ),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem),
            });

            // Pairing
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, "");
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on("creds.update", saveCreds);

            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);

                    const rf = `./temp/${id}/creds.json`;

                    // Identifiant Mega
                    const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                    const string_session = mega_url.replace("https://mega.nz/file/", "");
                    const md = "malvin~" + string_session;

                    // Message principal
                    const code = await sock.sendMessage(sock.user.id, { text: md });

                    const desc = `*Hey there, MALVIN-XD User!* 👋🏻

Thanks for using *MALVIN-XD* — your session has been successfully created!

🔐 *Session ID:* Sent above  
⚠️ *Keep it safe!* Do NOT share this ID with anyone.

——————

*✅ Stay Updated:*  
Join our official WhatsApp Channel:  
https://whatsapp.com/channel/0029VbA6MSYJUM2TVOzCSb2A

*💻 Source Code:*  
Fork & explore the project on GitHub:  
https://github.com/XdKing2/MALVIN-XD

——————

> *© Powered by Malvin King*
Stay cool and hack smart. ✌🏻`;

                    await sock.sendMessage(
                        sock.user.id,
                        {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "ᴍᴀʟᴠɪɴ-xᴅ",
                                    thumbnailUrl: "https://files.catbox.moe/bqs70b.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VbA6MSYJUM2TVOzCSb2A",
                                    mediaType: 1,
                                    renderLargerThumbnail: true,
                                },
                            },
                        },
                        { quoted: code }
                    );

                    await delay(10);
                    sock.ws.close();
                    removeFile(`./temp/${id}`);

                    console.log(`👤 ${sock.user.id} Connected. Restarting...`);

                    await delay(10);
                    process.exit();
                }

                // Retry
                if (
                    connection === "close" &&
                    lastDisconnect?.error?.output?.statusCode !== 401
                ) {
                    await delay(10);
                    MALVIN_XD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted due to error.");

            removeFile(`./temp/${id}`);

            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await MALVIN_XD_PAIR_CODE();
});

export default router;
