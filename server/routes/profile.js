import { Router } from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, unlinkSync } from "fs";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, "..", "uploads", "profile");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `profile-${Date.now()}.${ext}`);
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

router.post("/photo", requireAuth, upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No photo uploaded" });

  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  if (profile && profile.photo) {
    const oldPath = join(uploadsDir, profile.photo.split("/").pop());
    if (existsSync(oldPath)) unlinkSync(oldPath);
  }

  const photoUrl = `/uploads/profile/${req.file.filename}`;
  db.prepare("UPDATE profile SET photo = ? WHERE id = 1").run(photoUrl);
  const updated = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(updated);
});

router.delete("/photo", requireAuth, (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  if (profile && profile.photo) {
    const filePath = join(uploadsDir, profile.photo.split("/").pop());
    if (existsSync(filePath)) unlinkSync(filePath);
  }
  db.prepare("UPDATE profile SET photo = NULL WHERE id = 1").run();
  const updated = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(updated);
});

export default router;
