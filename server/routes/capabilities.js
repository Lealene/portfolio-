import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const capabilities = db.prepare("SELECT * FROM capabilities ORDER BY id ASC").all();
  res.json(capabilities);
});

router.post("/", requireAuth, (req, res) => {
  const { title, description, icon_name } = req.body;
  const result = db.prepare("INSERT INTO capabilities (title, description, icon_name) VALUES (?, ?, ?)").run(title, description || "", icon_name || "Code");
  const capability = db.prepare("SELECT * FROM capabilities WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(capability);
});

router.put("/:id", requireAuth, (req, res) => {
  const { title, description, icon_name } = req.body;
  db.prepare("UPDATE capabilities SET title = ?, description = ?, icon_name = ? WHERE id = ?").run(title, description, icon_name, req.params.id);
  const capability = db.prepare("SELECT * FROM capabilities WHERE id = ?").get(req.params.id);
  if (!capability) return res.status(404).json({ error: "Capability not found" });
  res.json(capability);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM capabilities WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Capability not found" });
  res.json({ message: "Capability deleted" });
});

export default router;
