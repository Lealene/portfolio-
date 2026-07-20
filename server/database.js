import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, "portfolio.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    bio TEXT,
    email TEXT,
    location TEXT,
    social_github TEXT,
    social_linkedin TEXT,
    social_twitter TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    description TEXT,
    tags TEXT DEFAULT '[]',
    link TEXT DEFAULT '#'
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    label TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS capabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Code'
  );

  CREATE TABLE IF NOT EXISTS tech_logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resume (
    id INTEGER PRIMARY KEY DEFAULT 1,
    filename TEXT NOT NULL,
    original_name TEXT,
    uploaded_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const hasProfile = db.prepare("SELECT COUNT(*) as count FROM profile").get();
if (hasProfile.count === 0) {
  db.prepare(`
    INSERT INTO profile (id, name, title, tagline, bio, email, location, social_github, social_linkedin, social_twitter)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Lealene S Fajardo",
    "Full-Stack Developer",
    "I build modern web applications with clean code and intuitive interfaces. Passionate about creating digital experiences that make a difference.",
    "Passionate about building web applications that solve real-world problems. Skilled in frontend and backend development with a focus on clean, maintainable code.",
    "alex@example.com",
    "San Francisco, CA",
    "#",
    "#",
    "#"
  );
}

const hasProjects = db.prepare("SELECT COUNT(*) as count FROM projects").get();
if (hasProjects.count === 0) {
  const insert = db.prepare(
    "INSERT INTO projects (title, category, image, description, tags, link) VALUES (?, ?, ?, ?, ?, ?)"
  );
  insert.run("E-Commerce Platform", "Full-Stack", null, "A modern e-commerce platform built with React, Node.js, and Stripe integration. Features real-time inventory tracking and a seamless checkout experience.", JSON.stringify(["React", "Node.js", "MongoDB", "Stripe"]), "#");
  insert.run("Task Management App", "Web App", null, "A collaborative project management tool with drag-and-drop boards, real-time updates, and team workspace functionality.", JSON.stringify(["React", "Firebase", "Tailwind CSS"]), "#");
  insert.run("Weather Dashboard", "Frontend", null, "A responsive weather dashboard that displays real-time forecasts, interactive maps, and historical weather data visualizations.", JSON.stringify(["JavaScript", "REST API", "Chart.js"]), "#");
  insert.run("Portfolio Website", "Frontend", null, "A personal portfolio built with React and Tailwind CSS, featuring smooth animations, responsive design, and a contact form.", JSON.stringify(["React", "Tailwind CSS", "Lucide"]), "#");
}

const hasSkills = db.prepare("SELECT COUNT(*) as count FROM skills").get();
if (hasSkills.count === 0) {
  const insert = db.prepare("INSERT INTO skills (name, level) VALUES (?, ?)");
  insert.run("HTML5", 95);
  insert.run("CSS3 / Tailwind", 90);
  insert.run("JavaScript", 88);
  insert.run("React", 85);
  insert.run("Node.js", 80);
  insert.run("MongoDB", 75);
  insert.run("Python", 70);
  insert.run("Git / GitHub", 85);
}

const hasMetrics = db.prepare("SELECT COUNT(*) as count FROM metrics").get();
if (hasMetrics.count === 0) {
  const insert = db.prepare("INSERT INTO metrics (value, label) VALUES (?, ?)");
  insert.run("4+", "Years Experience");
  insert.run("50+", "Projects Completed");
  insert.run("30+", "Happy Clients");
  insert.run("10+", "Technologies");
}

const hasCapabilities = db.prepare("SELECT COUNT(*) as count FROM capabilities").get();
if (hasCapabilities.count === 0) {
  const insert = db.prepare("INSERT INTO capabilities (title, description, icon_name) VALUES (?, ?, ?)");
  insert.run("Frontend Development", "Building responsive, performant user interfaces with React, modern CSS, and pixel-perfect designs.", "Code");
  insert.run("UI/UX Design", "Creating intuitive, user-centered designs that balance aesthetics with functionality.", "Palette");
  insert.run("Backend Development", "Designing scalable APIs and server-side logic with Node.js, Express, and databases.", "Server");
  insert.run("Mobile Responsive", "Ensuring seamless experiences across all devices with mobile-first development.", "Smartphone");
}

const hasTechLogos = db.prepare("SELECT COUNT(*) as count FROM tech_logos").get();
if (hasTechLogos.count === 0) {
  const insert = db.prepare("INSERT INTO tech_logos (name, emoji) VALUES (?, ?)");
  insert.run("Java", "☕");
  insert.run("JavaScript", "⚡");
  insert.run("React", "⚛");
  insert.run("Python", "🐍");
  insert.run("Xampp", "🟢");
  insert.run("PHP", "🐘");
  insert.run("HTML", "🌐");
  insert.run("CSS", "🎨");
  insert.run("Claude AI", "🤖");
  insert.run("ChatGPT", "💬");
  insert.run("OpenCode", "⚡");
}

const hasAdmin = db.prepare("SELECT COUNT(*) as count FROM admins").get();
if (hasAdmin.count === 0) {
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run("admin", hash);
}

export default db;
