export default function SkillCard({ skill }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 transition-all duration-300 hover:border-slate-700">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-white">{skill.name}</h3>
        <span className="text-sm font-medium text-indigo-400">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
}
