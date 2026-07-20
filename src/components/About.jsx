import { useState, useEffect } from "react";
import { Code, Palette, Server, Smartphone } from "lucide-react";
import CapabilityCard from "./CapabilityCard";

const iconMap = { Code, Palette, Server, Smartphone };

export default function About() {
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/capabilities")
      .then((res) => res.json())
      .then((data) =>
        setCapabilities(data.map((c) => ({ ...c, icon: iconMap[c.icon_name] || Code })))
      )
      .catch(console.error);
  }, []);

  return (
    <section id="about" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            About Me
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            What I Do
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            I'm a full-stack developer with a passion for building beautiful,
            functional web applications. I love turning complex problems into
            simple, elegant solutions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.id} capability={capability} />
          ))}
        </div>
      </div>
    </section>
  );
}
