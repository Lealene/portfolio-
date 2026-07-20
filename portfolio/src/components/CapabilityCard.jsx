export default function CapabilityCard({ capability }) {
  return (
    <div>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
    </div>
  );
}
