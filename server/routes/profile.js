import { Router } from "express";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(profile);
});

router.put("/", requireAuth, (req, res) => {
  const { name, title, tagline, bio, email, location, social_github, social_linkedin, social_twitter } = req.body;
  db.prepare(`
    UPDATE profile SET name = ?, title = ?, tagline = ?, bio = ?, email = ?, location = ?,
    social_github = ?, social_linkedin = ?, social_twitter = ? WHERE id = 1
  `).run(name, title, tagline, bio, email, location, social_github, social_linkedin, social_twitter);
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(profile);
});

export default router;
