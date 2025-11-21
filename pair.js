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

import { uploadFile } from "./mega.js"; // Assure-toi que mega.js exporte `uploadFile`

const router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

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
        printQRInTerminal: true, // pour debug dans le terminal
        generateHighQualityLinkPreview: true,
        logger: pino({ level: "fatal" }),
        syncFullHistory: false,
        browser: Browsers.macOS(randomItem),
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            // On renvoie le QR/Pairing code au front
            res.json({ qr });
        }

        if (connection === "open") {
            const rf = `./temp/${id}/creds.json`;
            const mega_url = await uploadFile(rf, `${sock.user.id}.json`);
            console.log("Session uploaded to Mega:", mega_url);

            // Message principal
            const md = "malvin~" + mega_url.replace("https://mega.nz/file/", "");
            await sock.sendMessage(sock.user.id, { text: md });

            removeFile(`./temp/${id}`);
        }

        if (connection === "close" &&
            lastDisconnect?.error?.output?.statusCode !== 401
        ) {
            console.log("Retrying connection...");
        }
    });
});

export default router;
