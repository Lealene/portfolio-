import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.get("/", (req, res) => {
  const files = db.prepare("SELECT * FROM repo_files WHERE repo_id = ? ORDER BY sort_order ASC, id ASC").all(req.params.id);
  res.json(files);
});

router.post("/", requireAuth, (req, res) => {
  const { filename, file_url } = req.body;
  if (!filename || !file_url) return res.status(400).json({ error: "filename and file_url are required" });

  const repo = db.prepare("SELECT id FROM github_repos WHERE id = ?").get(req.params.id);
  if (!repo) return res.status(404).json({ error: "Repo not found" });

  const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM repo_files WHERE repo_id = ?").get(req.params.id);
  const sortOrder = (maxOrder.max_order || 0) + 1;

  const result = db.prepare(
    "INSERT INTO repo_files (repo_id, filename, file_url, sort_order) VALUES (?, ?, ?, ?)"
  ).run(req.params.id, filename, file_url, sortOrder);

  const file = db.prepare("SELECT * FROM repo_files WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(file);
});

router.delete("/:fileId", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM repo_files WHERE id = ? AND repo_id = ?").run(req.params.fileId, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "File not found" });
  res.json({ message: "File deleted" });
});

router.get("/:fileId/raw", async (req, res) => {
  const file = db.prepare("SELECT * FROM repo_files WHERE id = ? AND repo_id = ?").get(req.params.fileId, req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  const urlMatch = file.file_url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)/);
  if (!urlMatch) return res.status(400).json({ error: "Invalid GitHub file URL" });

  const [, owner, repo, path] = urlMatch;
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${path}`;
    const response = await fetch(rawUrl);
    if (!response.ok) return res.status(response.status).json({ error: "Failed to fetch file from GitHub" });
    const content = await response.text();
    res.json({ content, filename: file.filename });
  } catch {
    res.status(500).json({ error: "Failed to fetch file from GitHub" });
  }
});

export default router;
