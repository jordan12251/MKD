import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import server from "./qr.js";
import code from "./pair.js";

process.setMaxListeners(500);

const app = express();
const PORT = process.env.PORT || 8000;

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use("/server", server);
app.use("/code", code);

app.use("/pair", (req, res) => {
    res.sendFile(path.join(__dirname, "pair.html"));
});

app.use("/qr", (req, res) => {
    res.sendFile(path.join(__dirname, "qr.html"));
});

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "main.html"));
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server
app.listen(PORT, () => {
    console.log(`
Don't Forget To Give A Star MALVIN-XD ⭐

Server running on http://localhost:${PORT}
`);
});

export default app;
