import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import metricRoutes from "./routes/metrics.js";
import capabilityRoutes from "./routes/capabilities.js";
import techLogoRoutes from "./routes/techLogos.js";
import messageRoutes from "./routes/messages.js";
import resumeRoutes from "./routes/resume.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/metrics", metricRoutes);
app.use("/api/capabilities", capabilityRoutes);
app.use("/api/tech-logos", techLogoRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
