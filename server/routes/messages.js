import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(messages);
});

router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }
  const result = db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)").run(name, email, message);
  const msg = db.prepare("SELECT * FROM messages WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(msg);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Message not found" });
  res.json({ message: "Message deleted" });
});

export default router;
