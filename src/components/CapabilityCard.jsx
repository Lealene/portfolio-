export default function CapabilityCard({ capability }) {
  const Icon = capability.icon;
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{capability.title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">
        {capability.description}
      </p>
    </div>
  );
}
