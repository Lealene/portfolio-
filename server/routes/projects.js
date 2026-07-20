import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const projects = db.prepare("SELECT * FROM projects ORDER BY id ASC").all();
  res.json(projects.map((p) => ({ ...p, tags: JSON.parse(p.tags) })));
});

router.get("/:id", (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json({ ...project, tags: JSON.parse(project.tags) });
});

router.post("/", requireAuth, (req, res) => {
  const { title, category, image, description, tags, link } = req.body;
  const result = db.prepare(
    "INSERT INTO projects (title, category, image, description, tags, link) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(title, category, image || null, description || "", JSON.stringify(tags || []), link || "#");
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ ...project, tags: JSON.parse(project.tags) });
});

router.put("/:id", requireAuth, (req, res) => {
  const { title, category, image, description, tags, link } = req.body;
  db.prepare(
    "UPDATE projects SET title = ?, category = ?, image = ?, description = ?, tags = ?, link = ? WHERE id = ?"
  ).run(title, category, image || null, description || "", JSON.stringify(tags || []), link || "#", req.params.id);
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json({ ...project, tags: JSON.parse(project.tags) });
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Project not found" });
  res.json({ message: "Project deleted" });
});

export default router;
