import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

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
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
