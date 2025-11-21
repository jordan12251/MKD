
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("QR route active");
});

export default router;
