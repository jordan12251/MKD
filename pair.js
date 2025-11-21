import express from "express";
import fs from "fs";
import pino from "pino";
import { makeid } from "./gen-id.js";
import { uploadFile } from "./mega.js";

import {
  default as makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys";

const router = express.Router();

function removeFile(filePath) {
  if (fs.existsSync(filePath)) fs.rmSync(filePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
  const id = makeid();
  let num = req.query.number;

  async function MALVIN_XD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

    try {
      const items = ["Safari"];
      const randomItem = items[Math.floor(Math.random() * items.length)];

      const sock = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
        },
        printQRInTerminal: false,
        generateHighQualityLinkPreview: true,
        logger: pino({ level: "fatal" }),
        syncFullHistory: false,
        browser: Browsers.macOS(randomItem)
      });

      if (!sock.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, "");
        const code = await sock.requestPairingCode(num);
        if (!res.headersSent) return res.json({ code });
      }

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;

        if (connection === "open") {
          await delay(5000);
          const rf = `./temp/${id}/creds.json`;

          const mega_url = await uploadFile(fs.createReadStream(rf), `${sock.user.id}.json`);
          const string_session = mega_url.replace("https://mega.nz/file/", "");
          const md = "malvin~" + string_session;

          await sock.sendMessage(sock.user.id, { text: md });
          removeFile(`./temp/${id}`);
          console.log(`👤 ${sock.user.id} Connected. Session sauvegardée.`);
          sock.ws.close();
        }

        if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
          await delay(10);
          MALVIN_XD_PAIR_CODE();
        }
      });
    } catch (err) {
      console.log("Service restarted due to error:", err);
      removeFile(`./temp/${id}`);
      if (!res.headersSent) res.json({ code: "❗ Service Unavailable" });
    }
  }

  return await MALVIN_XD_PAIR_CODE();
});

export default router;
