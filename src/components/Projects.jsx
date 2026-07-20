import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "./ProjectCard";

const API = "http://localhost:3001/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Frontend", description: "", tags: "", link: "#" });
  const { isAuthenticated, authFetch } = useAuth();

  const fetchProjects = () => {
    fetch(`${API}/projects`)
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await authFetch(`${API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    setForm({ title: "", category: "Frontend", description: "", tags: "", link: "#" });
    setShowAdd(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await authFetch(`${API}/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleUpdate = async (id, data) => {
    await authFetch(`${API}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProjects();
  };

  const handleImageUpload = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    await authFetch(`${API}/projects/${id}/image`, {
      method: "POST",
      body: formData,
    });
    fetchProjects();
  };

  const handleImageDelete = async (id) => {
    await authFetch(`${API}/projects/${id}/image`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <section id="work" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            My Work
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Here are some of my recent projects. Each one presented unique
            challenges and opportunities to learn.
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          )}
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="mx-auto mb-8 max-w-xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <input
              type="text"
              placeholder="Project Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option>Frontend</option>
              <option>Full-Stack</option>
              <option>Web App</option>
              <option>Backend</option>
              <option>Mobile</option>
            </select>
            <textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Live Demo Link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
                Create Project
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
