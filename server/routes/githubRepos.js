import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";
import repoFilesRouter from "./repoFiles.js";

const router = Router();

router.use("/:id/files", repoFilesRouter);

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function fetchGitHubRepo(owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!res.ok) return null;
  return res.json();
}

router.get("/", (req, res) => {
  const repos = db.prepare("SELECT * FROM github_repos ORDER BY sort_order ASC, id ASC").all();
  res.json(repos);
});

router.post("/", requireAuth, async (req, res) => {
  const { repo_url } = req.body;
  if (!repo_url) return res.status(400).json({ error: "repo_url is required" });

  const parsed = parseGitHubUrl(repo_url);
  if (!parsed) return res.status(400).json({ error: "Invalid GitHub URL" });

  const ghData = await fetchGitHubRepo(parsed.owner, parsed.repo);
  if (!ghData) return res.status(404).json({ error: "Repository not found on GitHub" });

  const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM github_repos").get();
  const sortOrder = (maxOrder.max_order || 0) + 1;

  const result = db.prepare(
    "INSERT INTO github_repos (repo_url, name, description, language, stars, forks, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    repo_url,
    ghData.name || `${parsed.owner}/${parsed.repo}`,
    ghData.description || "",
    ghData.language || "",
    ghData.stargazers_count || 0,
    ghData.forks_count || 0,
    sortOrder
  );

  const repo = db.prepare("SELECT * FROM github_repos WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(repo);
});

router.put("/:id", requireAuth, (req, res) => {
  const { sort_order } = req.body;
  db.prepare("UPDATE github_repos SET sort_order = ? WHERE id = ?").run(sort_order, req.params.id);
  const repo = db.prepare("SELECT * FROM github_repos WHERE id = ?").get(req.params.id);
  if (!repo) return res.status(404).json({ error: "Repo not found" });
  res.json(repo);
});

router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM github_repos WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Repo not found" });
  res.json({ message: "Repo deleted" });
});

export default router;
