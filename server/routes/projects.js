import { Router } from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, unlinkSync } from "fs";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, "..", "uploads", "projects");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `project-${req.params.id}-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

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
  const { title, category, image, description, tags, link, demo_url } = req.body;
  const result = db.prepare(
    "INSERT INTO projects (title, category, image, description, tags, link, demo_url) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(title, category, image || null, description || "", JSON.stringify(tags || []), link || "#", demo_url || "");
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ ...project, tags: JSON.parse(project.tags) });
});

router.put("/:id", requireAuth, (req, res) => {
  const { title, category, image, description, tags, link, demo_url } = req.body;
  db.prepare(
    "UPDATE projects SET title = ?, category = ?, image = ?, description = ?, tags = ?, link = ?, demo_url = ? WHERE id = ?"
  ).run(title, category, image || null, description || "", JSON.stringify(tags || []), link || "#", demo_url || "", req.params.id);
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json({ ...project, tags: JSON.parse(project.tags) });
});

router.delete("/:id", requireAuth, (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (project && project.image) {
    const filePath = join(uploadsDir, project.image.split("/").pop());
    if (existsSync(filePath)) unlinkSync(filePath);
  }
  const result = db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Project not found" });
  res.json({ message: "Project deleted" });
});

router.post("/:id/image", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (project.image) {
    const oldPath = join(uploadsDir, project.image.split("/").pop());
    if (existsSync(oldPath)) unlinkSync(oldPath);
  }
  const imageUrl = `/uploads/projects/${req.file.filename}`;
  db.prepare("UPDATE projects SET image = ? WHERE id = ?").run(imageUrl, req.params.id);
  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags) });
});

router.delete("/:id/image", requireAuth, (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (project.image) {
    const filePath = join(uploadsDir, project.image.split("/").pop());
    if (existsSync(filePath)) unlinkSync(filePath);
  }
  db.prepare("UPDATE projects SET image = NULL WHERE id = ?").run(req.params.id);
  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  res.json({ ...updated, tags: JSON.parse(updated.tags) });
});

export default router;
