export default function MetricCard({ metric }) {
  return (
    <div className="text-center">
      <h3 className="mb-1 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        {metric.value}
      </h3>
      <p className="text-sm text-slate-400">{metric.label}</p>
    </div>
  );
}
