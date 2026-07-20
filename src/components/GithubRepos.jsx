import { useState, useEffect } from "react";
import { Plus, Code } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RepoCard from "./RepoCard";

const API = "http://localhost:3001/api";

export default function GithubRepos() {
  const [repos, setRepos] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, authFetch } = useAuth();

  const fetchRepos = () => {
    fetch(`${API}/github-repos`)
      .then((res) => res.json())
      .then(setRepos)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authFetch(`${API}/github-repos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add repo");
      setUrl("");
      setShowAdd(false);
      fetchRepos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await authFetch(`${API}/github-repos/${id}`, { method: "DELETE" });
    fetchRepos();
  };

  return (
    <section id="repos" className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            Open Source
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            GitHub Repositories
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Projects and repositories I've contributed to or created on GitHub.
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Add Repo
            </button>
          )}
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="mx-auto mb-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:flex-row">
            <input
              type="url"
              placeholder="https://github.com/user/repo"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              <Code className="h-4 w-4" />
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        )}

        {error && (
          <p className="mb-6 text-center text-sm text-red-400">{error}</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onDelete={isAuthenticated ? handleDelete : null}
              isAuthenticated={isAuthenticated}
              authFetch={isAuthenticated ? authFetch : null}
            />
          ))}
        </div>

        {repos.length === 0 && (
          <p className="text-center text-slate-500">
            No repositories added yet.
          </p>
        )}
      </div>
    </section>
  );
}
