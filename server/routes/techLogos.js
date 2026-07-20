import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const techLogos = db.prepare("SELECT * FROM tech_logos ORDER BY id ASC").all();
  res.json(techLogos);
});

router.post("/", requireAuth, (req, res) => {
  const { name, emoji } = req.body;
  const result = db.prepare("INSERT INTO tech_logos (name, emoji) VALUES (?, ?)").run(name, emoji);
  const techLogo = db.prepare("SELECT * FROM tech_logos WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(techLogo);
});

router.put("/:id", requireAuth, (req, res) => {
  const { name, emoji } = req.body;
  db.prepare("UPDATE tech_logos SET name = ?, emoji = ? WHERE id = ?").run(name, emoji, req.params.id);
  const techLogo = db.prepare("SELECT * FROM tech_logos WHERE id = ?").get(req.params.id);
  if (!techLogo) return res.status(404).json({ error: "Tech logo not found" });
  res.json(techLogo);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM tech_logos WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Tech logo not found" });
  res.json({ message: "Tech logo deleted" });
});

export default router;
