import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const skills = db.prepare("SELECT * FROM skills ORDER BY id ASC").all();
  res.json(skills);
});

router.get("/:id", (req, res) => {
  const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.id);
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  res.json(skill);
});

router.post("/", requireAuth, (req, res) => {
  const { name, level } = req.body;
  const result = db.prepare("INSERT INTO skills (name, level) VALUES (?, ?)").run(name, level || 0);
  const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(skill);
});

router.put("/:id", requireAuth, (req, res) => {
  const { name, level } = req.body;
  db.prepare("UPDATE skills SET name = ?, level = ? WHERE id = ?").run(name, level, req.params.id);
  const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.id);
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  res.json(skill);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM skills WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Skill not found" });
  res.json({ message: "Skill deleted" });
});

export default router;
