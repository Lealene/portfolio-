import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("Lealene S Fajardo");
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    fetch("http://localhost:3001/api/profile")
      .then((res) => res.json())
      .then((data) => setName(data.name))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      setShowLogin(false);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-slate-950/90 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#home"
          className="text-xl font-bold text-white transition-colors hover:text-indigo-400"
        >
          {name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm font-medium text-red-400 transition-colors hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                <LogIn className="h-4 w-4" />
                Admin
              </button>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated ? (
            <button onClick={logout} className="text-red-400" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <button onClick={() => setShowLogin(!showLogin)} className="text-indigo-400" aria-label="Admin login">
              <LogIn className="h-5 w-5" />
            </button>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {showLogin && (
        <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-md">
          <form onSubmit={handleLogin} className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:px-8">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
            >
              Login
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      )}

      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
