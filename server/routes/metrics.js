import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const metrics = db.prepare("SELECT * FROM metrics ORDER BY id ASC").all();
  res.json(metrics);
});

router.post("/", requireAuth, (req, res) => {
  const { value, label } = req.body;
  const result = db.prepare("INSERT INTO metrics (value, label) VALUES (?, ?)").run(value, label);
  const metric = db.prepare("SELECT * FROM metrics WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(metric);
});

router.put("/:id", requireAuth, (req, res) => {
  const { value, label } = req.body;
  db.prepare("UPDATE metrics SET value = ?, label = ? WHERE id = ?").run(value, label, req.params.id);
  const metric = db.prepare("SELECT * FROM metrics WHERE id = ?").get(req.params.id);
  if (!metric) return res.status(404).json({ error: "Metric not found" });
  res.json(metric);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM metrics WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Metric not found" });
  res.json({ message: "Metric deleted" });
});

export default router;
