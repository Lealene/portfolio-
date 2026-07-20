import { useState, useEffect } from "react";

export default function Metrics() {
  const [techLogos, setTechLogos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/tech-logos")
      .then((res) => res.json())
      .then(setTechLogos)
      .catch(console.error);
  }, []);

  return (
    <section className="overflow-hidden border-y border-slate-800 bg-slate-900/50 py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-indigo-400">
          Technologies I Use
        </p>
        <div className="relative">
          <div className="flex animate-slide-left gap-12" style={{ width: "max-content" }}>
            {[...techLogos, ...techLogos, ...techLogos].map((tech, i) => (
              <div
                key={`${tech.id}-${i}`}
                className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-950/50 px-5 py-3"
              >
                <span className="text-2xl">{tech.emoji}</span>
                <span className="font-semibold text-white whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
