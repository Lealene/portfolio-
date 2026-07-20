import { useState } from "react";

const placeholders = [
  "from-indigo-600 to-purple-600",
  "from-cyan-600 to-blue-600",
  "from-emerald-600 to-teal-600",
  "from-orange-600 to-pink-600",
];

export default function ProjectCard({ project, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

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
                src={project.image}
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
            <p className="mt-4 text-xs text-slate-500">Click to flip &rarr;</p>
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
