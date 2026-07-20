import { useState, useEffect } from "react";
import { ArrowDown, Download, Camera, Trash2, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FloatingTechIcons from "./FloatingTechIcons";

const API = "http://localhost:3001/api";

export default function Hero() {
  const [flipped, setFlipped] = useState(false);
  const [profile, setProfile] = useState({ name: "Lealene S Fajardo", title: "Full-Stack Developer", tagline: "", bio: "", photo: null });
  const [resumeInfo, setResumeInfo] = useState({ uploaded: false });
  const [resumeKey, setResumeKey] = useState(Date.now());
  const { isAuthenticated, authFetch } = useAuth();

  useEffect(() => {
    fetch(`${API}/profile`)
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
    fetch(`${API}/resume`)
      .then((res) => res.json())
      .then(setResumeInfo)
      .catch(console.error);
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const res = await authFetch(`${API}/profile/photo`, { method: "POST", body: formData });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to upload photo:", err);
    }
  };

  const handlePhotoDelete = async () => {
    try {
      const res = await authFetch(`${API}/profile/photo`, { method: "DELETE" });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to delete photo:", err);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await authFetch(`${API}/resume`, { method: "POST", body: formData });
      const data = await res.json();
      setResumeInfo(data);
      setResumeKey(Date.now());
    } catch (err) {
      console.error("Failed to upload resume:", err);
    }
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-20"
    >
      <div className="absolute inset-0">
        <FloatingTechIcons iconCount={26} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-400">
              {profile.title}
            </p>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-400 md:text-xl">
              {profile.tagline}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-slate-900"
              >
                Get In Touch
              </a>
              <a
                href={`${API}/resume/download?t=${resumeKey}`}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-3 text-sm font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
              {isAuthenticated && (
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white">
                  <Upload className="h-4 w-4" />
                  {resumeInfo.uploaded ? "Replace Resume" : "Upload Resume"}
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 perspective-[1000px]">
            <div
              onClick={() => setFlipped(!flipped)}
              className="relative h-56 w-56 cursor-pointer [transform-style:preserve-3d] transition-transform duration-700 sm:h-72 sm:w-72 md:h-[26rem] md:w-[26rem] hover:scale-[1.02]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* Front */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 [backface-visibility:hidden]">
                {profile.photo ? (
                  <img
                    src={`http://localhost:3001${profile.photo}`}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <span className="text-6xl font-bold text-white md:text-7xl">
                      {initials}
                    </span>
                  </div>
                )}

                {/* Admin photo controls */}
                {isAuthenticated && (
                  <div
                    className="absolute top-3 right-3 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white transition-colors hover:bg-black/80">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                    {profile.photo && (
                      <button
                        onClick={handlePhotoDelete}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-red-400 transition-colors hover:bg-black/80 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-950 to-transparent p-4 text-center">
                  <p className="text-xs text-slate-500">Click to flip &rarr;</p>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 overflow-y-auto rounded-2xl border-2 border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex h-full flex-col items-center justify-center p-4 text-center sm:p-6">
                  <h3 className="mb-1 text-base font-bold text-white sm:text-lg">
                    {profile.name}
                  </h3>
                  <p className="mb-2 text-xs text-indigo-400 sm:text-sm">
                    {profile.title}
                  </p>
                  <p className="mb-3 text-[10px] leading-relaxed text-slate-400 sm:mb-4 sm:text-xs">
                    {profile.bio}
                  </p>
                  <div className="mb-3 w-full border-t border-slate-800" />
                  <div className="w-full space-y-2 text-left">
                    <div className="flex justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-400">Languages</span>
                      <span className="text-white">Java, JS, Python, PHP</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-400">Frontend</span>
                      <span className="text-white">React, HTML, CSS</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-400">Tools</span>
                      <span className="text-white">Xampp, Git, AI</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-600">
                    &larr; Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center lg:mt-24">
          <a
            href="#about"
            className="animate-bounce rounded-full border border-slate-700 p-3 text-slate-400 transition-colors hover:text-white"
          >
            <ArrowDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
