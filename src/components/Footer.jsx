import { useState, useEffect } from "react";
import { Globe, ExternalLink } from "lucide-react";

export default function Footer() {
  const [profile, setProfile] = useState({ name: "Lealene S Fajardo", social_github: "#", social_linkedin: "#", social_twitter: "#" });

  useEffect(() => {
    fetch("http://localhost:3001/api/profile")
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 md:flex-row md:justify-between md:px-8">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href={profile.social_github}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-all hover:border-slate-600 hover:text-white"
            aria-label="GitHub"
          >
            <Globe className="h-4 w-4" />
          </a>
          <a
            href={profile.social_linkedin}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-all hover:border-slate-600 hover:text-white"
            aria-label="LinkedIn"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={profile.social_twitter}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-all hover:border-slate-600 hover:text-white"
            aria-label="Twitter"
          >
            <Globe className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
