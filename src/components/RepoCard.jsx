import { useState, useEffect, useCallback } from "react";
import { Star, GitFork, ExternalLink, FileText, Plus, X, Eye, Loader2, Copy, Check } from "lucide-react";

const API = "http://localhost:3001/api";

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

const fileLangMap = {
  js: "JavaScript", jsx: "JavaScript", ts: "TypeScript", tsx: "TypeScript",
  py: "Python", java: "Java", html: "HTML", css: "CSS", php: "PHP",
  cpp: "C++", c: "C", h: "C", go: "Go", rs: "Rust", rb: "Ruby",
  swift: "Swift", kt: "Kotlin", dart: "Dart", sh: "Shell", bash: "Shell",
  vue: "Vue", svelte: "Svelte", json: "JSON", md: "Markdown", yml: "YAML",
  yaml: "YAML", xml: "XML", sql: "SQL", graphql: "GraphQL",
};

function getLangFromFilename(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return fileLangMap[ext] || ext.toUpperCase();
}

function CodeModal({ file, onClose }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API}/github-repos/${file.repo_id}/files/${file.id}/raw`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load file");
        return res.json();
      })
      .then((data) => setContent(data.content))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [file]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = getLangFromFilename(file.filename);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">{file.filename}</span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{lang}</span>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
            <a
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              GitHub
            </a>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
              <span className="ml-2 text-sm text-slate-400">Loading file...</span>
            </div>
          )}
          {error && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <ExternalLink className="h-3 w-3" />
                View on GitHub instead
              </a>
            </div>
          )}
          {!loading && !error && (
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-300">
              <code>{content}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RepoCard({ repo, onDelete, isAuthenticated, authFetch }) {
  const [files, setFiles] = useState([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [filename, setFilename] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [viewingFile, setViewingFile] = useState(null);
  const color = langColors[repo.language] || "#8b8b8b";

  const fetchFiles = useCallback(() => {
    fetch(`${API}/github-repos/${repo.id}/files`)
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, [repo.id]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!authFetch) return;
    await authFetch(`${API}/github-repos/${repo.id}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, file_url: fileUrl }),
    });
    setFilename("");
    setFileUrl("");
    setShowAddFile(false);
    fetchFiles();
  };

  const handleDeleteFile = async (fileId) => {
    if (!authFetch) return;
    await authFetch(`${API}/github-repos/${repo.id}/files/${fileId}`, { method: "DELETE" });
    fetchFiles();
  };

  return (
    <>
      <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {repo.name}
          </h3>
          <a
            href={repo.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-400 line-clamp-2">
          {repo.description || "No description provided."}
        </p>

        <div className="flex items-center gap-4 mb-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-400">{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs text-slate-400">{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">{repo.forks}</span>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingFile(file)}
                    className="flex items-center gap-2 text-xs text-slate-300 transition-colors hover:text-indigo-400"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    {file.filename}
                    <Eye className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:text-slate-300"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:text-red-400"
                      title="Remove file"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated && showAddFile && (
          <form onSubmit={handleAddFile} className="mb-4 space-y-2 rounded-xl border border-slate-700 bg-slate-800 p-3">
            <input
              type="text"
              placeholder="Filename (e.g. README.md)"
              required
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <input
              type="url"
              placeholder="File URL (GitHub link)"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-indigo-500">
                Add
              </button>
              <button type="button" onClick={() => setShowAddFile(false)} className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        )}

        {isAuthenticated && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAddFile(!showAddFile)}
              className="flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
            >
              <Plus className="h-3 w-3" />
              Add File
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Delete this repo?")) onDelete(repo.id);
                }}
                className="text-xs text-red-400 transition-colors hover:text-red-300"
              >
                Delete Repo
              </button>
            )}
          </div>
        )}

        {!isAuthenticated && files.length === 0 && onDelete && (
          <button
            onClick={() => {
              if (confirm("Delete this repo?")) onDelete(repo.id);
            }}
            className="mt-4 text-xs text-red-400 transition-colors hover:text-red-300"
          >
            Delete
          </button>
        )}
      </div>

      {viewingFile && <CodeModal file={viewingFile} onClose={() => setViewingFile(null)} />}
    </>
  );
}
