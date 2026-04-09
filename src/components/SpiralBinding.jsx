import './SpiralBinding.css';

export default function SpiralBinding() {
  const spirals = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="spiral-binding" id="spiral-binding">
      {spirals.map((i) => (
        <div key={i} className="spiral-ring">
          <div className="spiral-ring-inner" />
        </div>
      ))}
    </div>
  );
}
