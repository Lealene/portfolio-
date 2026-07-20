import { useState, useEffect } from "react";
import SkillCard from "./SkillCard";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/skills")
      .then((res) => res.json())
      .then(setSkills)
      .catch(console.error);
  }, []);

  return (
    <section id="skills" className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            My Skills
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Technologies I Work With
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            I'm constantly learning and expanding my skill set to stay current
            with the latest technologies and best practices.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
