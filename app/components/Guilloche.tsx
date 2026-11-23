export default function Guilloche({ lines, ratio, side }: { lines: number; ratio: number; side: "left" | "right" }) {
  return (
    <svg className={`guilloche ${side}`} viewBox="-100 -100 200 200" aria-hidden="true">
      <g>
        {Array.from({ length: lines }, (_, i) => (
          <ellipse key={i} rx="98" ry={98 * ratio} transform={`rotate(${(i * 180) / lines})`} />
        ))}
      </g>
    </svg>
  );
}
