import { useState, useEffect } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [profile, setProfile] = useState({ email: "alex@example.com", location: "San Francisco, CA" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/profile")
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");
    fetch("http://localhost:3001/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send");
        return res.json();
      })
      .then(() => {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => setStatus("Failed to send message. Try again."));
  };

  return (
    <section id="contact" className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            Contact
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Get In Touch
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Have a project in mind or want to collaborate? I'd love to hear from
            you. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <Mail className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium text-white">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <MapPin className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="font-medium text-white">{profile.location}</p>
              </div>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
            />
            {status && (
              <p className={`text-sm ${status.includes("success") ? "text-green-400" : "text-red-400"}`}>
                {status}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
