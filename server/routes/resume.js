import { Router } from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, unlinkSync } from "fs";
import db from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, "resume.pdf"),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

const router = Router();

router.get("/", (req, res) => {
  const resume = db.prepare("SELECT * FROM resume WHERE id = 1").get();
  if (!resume) return res.json({ uploaded: false });
  res.json({ uploaded: true, filename: resume.filename, original_name: resume.original_name, uploaded_at: resume.uploaded_at });
});

router.get("/download", (req, res) => {
  const filePath = join(uploadsDir, "resume.pdf");
  if (!existsSync(filePath)) return res.status(404).json({ error: "Resume not found" });
  res.download(filePath, "resume.pdf");
});

router.post("/", requireAuth, upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const existing = db.prepare("SELECT * FROM resume WHERE id = 1").get();
  if (existing) {
    db.prepare("UPDATE resume SET filename = ?, original_name = ?, uploaded_at = datetime('now') WHERE id = 1").run("resume.pdf", req.file.originalname);
  } else {
    db.prepare("INSERT INTO resume (id, filename, original_name) VALUES (1, ?, ?)").run("resume.pdf", req.file.originalname);
  }
  const resume = db.prepare("SELECT * FROM resume WHERE id = 1").get();
  res.json({ uploaded: true, filename: resume.filename, original_name: resume.original_name, uploaded_at: resume.uploaded_at });
});

router.delete("/", requireAuth, (req, res) => {
  const filePath = join(uploadsDir, "resume.pdf");
  if (existsSync(filePath)) unlinkSync(filePath);
  db.prepare("DELETE FROM resume WHERE id = 1").run();
  res.json({ message: "Resume deleted" });
});

export default router;
