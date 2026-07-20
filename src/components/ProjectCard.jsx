import { useState, useRef } from "react";
import { Camera, Trash2, Image, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const placeholders = [
  "from-indigo-600 to-purple-600",
  "from-cyan-600 to-blue-600",
  "from-emerald-600 to-teal-600",
  "from-orange-600 to-pink-600",
];

export default function ProjectCard({ project, index = 0, onDelete, onUpdate, onImageUpload, onImageDelete }) {
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: project.title,
    category: project.category,
    description: project.description,
    tags: project.tags.join(", "),
    link: project.link,
  });
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onImageUpload(project.id, file);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onUpdate(project.id, {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      tags: project.tags.join(", "),
      link: project.link,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border border-indigo-500/50 bg-slate-900 p-6"
      >
        <h3 className="mb-4 text-lg font-bold text-white">Edit Project</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
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
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Live Demo Link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
              Save
            </button>
            <button type="button" onClick={handleCancel} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="group cursor-pointer perspective-[1200px]"
    >
      <div
        className={`relative h-[420px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 [backface-visibility:hidden]">
          <div className="relative h-56 overflow-hidden">
            {project.image ? (
              <img
                src={`http://localhost:3001${project.image}`}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
                  placeholders[index % placeholders.length]
                }`}
              >
                <span className="text-5xl font-bold text-white/20">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            <span className="absolute bottom-3 left-3 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
              {project.category}
            </span>

            {isAuthenticated && (
              <div className="absolute top-3 right-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                  title="Upload image"
                >
                  {uploading ? (
                    <Image className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                {project.image && (
                  <button
                    onClick={() => onImageDelete(project.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white transition-all hover:bg-red-600"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="mb-3 text-xl font-bold text-white">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">Click to flip &rarr;</p>
              {isAuthenticated && (
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setForm({
                        title: project.title,
                        category: project.category,
                        description: project.description,
                        tags: project.tags.join(", "),
                        link: project.link,
                      });
                      setEditing(true);
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this project?")) onDelete(project.id);
                    }}
                    className="text-xs text-red-400 transition-colors hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <span className="mb-3 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {project.category}
              </span>
              <h3 className="mb-4 text-2xl font-bold text-white">
                {project.title}
              </h3>
              <p className="mb-6 leading-relaxed text-slate-400">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={project.link}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
              >
                Live Demo
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
              >
                &larr; Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
