import type { SceneKind } from "../content";
import s from "./Scene.module.css";

const delay = (sec: number) => ({ animationDelay: `${sec}s` });

function Dot({ path, dur, begin = 0, r = 2.6, muted = false }: { path: string; dur: number; begin?: number; r?: number; muted?: boolean }) {
  return (
    <circle r={r} className={muted ? s.dotMuted : s.dot}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function Gateway() {
  const ins = ["M20 30 C80 30 100 80 160 80", "M20 80 L160 80", "M20 130 C80 130 100 80 160 80"];
  const outs = ["M160 80 C220 80 240 30 300 30", "M160 80 L300 80", "M160 80 C220 80 240 130 300 130"];
  return (
    <>
      {[...ins, ...outs].map((d) => (
        <path key={d} d={d} className={s.wire} />
      ))}
      <path d="M160 80 L160 138" className={`${s.wire} ${s.dash}`} />
      {ins.map((d, i) => (
        <Dot key={d} path={d} dur={2.4} begin={i * 0.8} />
      ))}
      {outs.map((d, i) => (
        <Dot key={d} path={d} dur={2.4} begin={1.2 + i * 0.8} muted />
      ))}
      {[30, 80, 130].map((y) => (
        <rect key={`a${y}`} x="8" y={y - 7} width="14" height="14" rx="3" className={s.node} />
      ))}
      {[30, 80, 130].map((y) => (
        <rect key={`b${y}`} x="298" y={y - 6} width="12" height="12" className={s.node} />
      ))}
      <circle cx="160" cy="80" r="16" className={`${s.ring} ${s.pulse}`} />
      <circle cx="160" cy="80" r="7" className={s.hub} />
      <ellipse cx="160" cy="142" rx="14" ry="5" className={s.node} />
      <path d="M146 142 v10 a14 5 0 0 0 28 0 v-10" className={s.node} />
    </>
  );
}

function Exchange() {
  const wave = "M0 90 L20 84 L40 96 L60 70 L80 78 L100 60 L120 72 L140 52 L160 66 L180 48 L200 70 L220 58 L240 80 L260 64 L280 86 L300 74 L320 90";
  return (
    <>
      <line x1="0" y1="122" x2="320" y2="122" className={`${s.wire} ${s.dash}`} />
      <line x1="0" y1="66" x2="320" y2="66" className={`${s.wire} ${s.dash}`} />
      <g className={s.scrollX}>
        <path d={wave} className={s.line} />
        <path d={wave} className={s.line} transform="translate(320 0)" />
      </g>
      {[40, 100, 160, 220, 280].map((x, i) => (
        <rect key={x} x={x - 4} y={100 - (i % 3) * 14} width="8" height={18 + (i % 2) * 10} className={s.candle} style={delay(i * 0.3)} />
      ))}
      <circle cx="300" cy="66" r="5" className={s.hub} />
      <circle cx="300" cy="66" r="12" className={`${s.ring} ${s.pulse}`} />
    </>
  );
}

function Stream() {
  return (
    <>
      <rect x="8" y="22" width="34" height="116" rx="6" className={s.node} />
      <rect x="278" y="22" width="34" height="116" rx="6" className={s.node} />
      {[44, 80, 116].map((y, lane) => (
        <g key={y}>
          <line x1="48" y1={y} x2="272" y2={y} className={s.wire} />
          {[0, 1, 2].map((k) => (
            <rect key={k} x="44" y={y - 6} width="22" height="12" rx="2" className={s.msg} style={delay(lane * 0.5 + k * 1.1)} />
          ))}
          <path d={`M289 ${y} l4 4 l8 -8`} className={s.tick} style={delay(lane * 0.5 + 1.6)} />
        </g>
      ))}
    </>
  );
}

function Web() {
  return (
    <>
      <rect x="30" y="12" width="260" height="140" rx="8" className={s.node} />
      <line x1="30" y1="32" x2="290" y2="32" className={s.wire} />
      {[44, 56, 68].map((x) => (
        <circle key={x} cx={x} cy="22" r="3" className={s.wire} />
      ))}
      <rect x="44" y="44" width="70" height="96" rx="4" className={s.skel} />
      <rect x="126" y="44" width="150" height="14" rx="3" className={`${s.skel} ${s.grow}`} style={delay(0.2)} />
      <rect x="126" y="66" width="110" height="10" rx="3" className={`${s.skel} ${s.grow}`} style={delay(0.4)} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const h = 20 + ((i * 37) % 40);
        return <rect key={i} x={130 + i * 24} y={140 - h} width="14" height={h} className={s.bar} style={delay(0.6 + i * 0.12)} />;
      })}
    </>
  );
}

function Docs() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.doc} style={delay(i * 0.9)}>
          <rect x={70 + i * 16} y={20 + i * 8} width="96" height="120" rx="4" className={`${s.node} ${s.solid}`} />
          {[0, 1, 2, 3].map((l) => (
            <line key={l} x1={84 + i * 16} y1={46 + i * 8 + l * 16} x2={150 + i * 16 - (l % 2) * 20} y2={46 + i * 8 + l * 16} className={s.wire} />
          ))}
        </g>
      ))}
      <circle cx="230" cy="104" r="26" className={s.seal} />
      <path d="M218 104 l8 8 l16 -16" className={s.seal} style={delay(0.6)} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={254 + (i % 2) * 22} cy={30 + Math.floor(i / 2) * 22} r="7" className={`${s.node} ${s.blink}`} style={delay(i * 0.4)} />
      ))}
    </>
  );
}

function Deploy() {
  return (
    <>
      <line x1="30" y1="80" x2="270" y2="80" className={s.wire} />
      <Dot path="M30 80 L270 80" dur={3.2} r={3.5} />
      {[30, 110, 190, 270].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="80" r="14" className={`${s.node} ${s.stage}`} style={delay(i * 0.8)} />
          <rect x={x - 12} y="112" width="24" height="4" rx="2" className={s.skel} style={delay(i * 0.8)} />
        </g>
      ))}
    </>
  );
}

function Ledger() {
  const rows = [28, 58, 88, 118];
  const pairs = [
    [0, 1],
    [1, 0],
    [2, 3],
  ];
  return (
    <>
      {rows.map((y) => (
        <g key={y}>
          <rect x="14" y={y - 9} width="92" height="18" rx="3" className={s.node} />
          <line x1="24" y1={y} x2="80" y2={y} className={s.wire} />
          <rect x="214" y={y - 9} width="92" height="18" rx="3" className={s.node} />
          <line x1="224" y1={y} x2="290" y2={y} className={s.wire} />
        </g>
      ))}
      {pairs.map(([a, b], i) => (
        <path key={i} d={`M106 ${rows[a]} C160 ${rows[a]} 160 ${rows[b]} 214 ${rows[b]}`} pathLength={1} className={s.match} style={delay(i * 0.7)} />
      ))}
      <path d="M106 118 C150 118 160 146 160 146" className={`${s.wire} ${s.dash}`} />
      <rect x="146" y="140" width="28" height="14" rx="3" className={`${s.node} ${s.blink}`} />
    </>
  );
}

function Finance() {
  const area = "M10 130 L50 110 L90 116 L130 86 L170 94 L210 60 L250 70 L310 34";
  return (
    <>
      {["CSV", "PDF", "OFX"].map((t, i) => (
        <g key={t} className={s.chip} style={delay(i * 0.5)}>
          <rect x={10 + i * 48} y="10" width="40" height="20" rx="10" className={s.node} />
          <text x={30 + i * 48} y="24" className={s.label} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <path d={`${area} L310 150 L10 150 Z`} className={s.area} />
      <path d={area} pathLength={1} className={`${s.line} ${s.draw}`} />
      <circle cx="310" cy="34" r="4" className={s.hub} />
    </>
  );
}

function Chain() {
  return (
    <>
      {["Functions", "Automation", "Data Feed"].map((t, i) => {
        const x = 80 + i * 80;
        return (
          <g key={t}>
            <text x={x} y="18" className={s.label} textAnchor="middle">
              {t}
            </text>
            <line x1={x} y1="26" x2={x} y2="84" className={`${s.wire} ${s.dash}`} />
            <Dot path={`M${x} 26 L${x} 84`} dur={1.8} begin={i * 0.6} r={2.2} muted />
          </g>
        );
      })}
      <line x1="20" y1="112" x2="300" y2="112" className={s.wire} />
      {[20, 100, 180, 260].map((x, i) => (
        <rect key={x} x={x} y="92" width="40" height="40" rx="6" className={`${s.node} ${s.block}`} style={delay(i * 0.6)} />
      ))}
      <Dot path="M40 112 L280 112" dur={3} r={4} />
    </>
  );
}

const scenes: Record<SceneKind, () => React.JSX.Element> = {
  gateway: Gateway,
  exchange: Exchange,
  stream: Stream,
  web: Web,
  docs: Docs,
  deploy: Deploy,
  ledger: Ledger,
  finance: Finance,
  chain: Chain,
};

export default function Scene({ kind, className = "" }: { kind: SceneKind; className?: string }) {
  const Art = scenes[kind];
  return (
    <svg className={`${s.scene} ${className}`} viewBox="0 0 320 160" aria-hidden="true">
      <Art />
    </svg>
  );
}
