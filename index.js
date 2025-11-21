import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import server from "./qr.js";
import code from "./pair.js";

process.setMaxListeners(500);

const app = express();

// Render fournit le port via process.env.PORT
const PORT = process.env.PORT;
if (!PORT) {
    console.error("❌ No PORT provided by Render. Exiting...");
    process.exit(1);
}

// __dirname replacement pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use("/server", server);
app.use("/code", code);

// Pages statiques
app.use("/pair", (req, res) => {
    res.sendFile(path.join(__dirname, "pair.html"));
});

app.use("/qr", (req, res) => {
    res.sendFile(path.join(__dirname, "qr.html"));
});

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "main.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`
✅ MALVIN-XD Server running!
🌐 Accessible on port: ${PORT}
Don't forget to give a star ⭐
`);
});

export default app;
