import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import server from "./qr.js";
import code from "./pair.js";

const app = express();
const PORT = process.env.PORT || 8000; // Render utilise process.env.PORT

// __dirname replacement en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/server", server);
app.use("/code", code);

app.get("/pair", (req, res) => {
  res.sendFile(path.join(__dirname, "pair.html"));
});

app.get("/qr", (req, res) => {
  res.sendFile(path.join(__dirname, "qr.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`✅ MALVIN-XD Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} or your Render URL`);
});

export default app;
