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
      <text x="15" y="156" textAnchor="middle" className={s.label}>
        Agents
      </text>
      <text x="304" y="156" textAnchor="middle" className={s.label}>
        Models
      </text>
      <circle cx="160" cy="80" r="16" className={`${s.ring} ${s.pulse}`} />
      <circle cx="160" cy="80" r="7" className={s.hub} />
      <ellipse cx="160" cy="142" rx="14" ry="5" className={s.node} />
      <path d="M146 142 v10 a14 5 0 0 0 28 0 v-10" className={s.node} />
    </>
  );
}

const candles = [
  [124, 106, 98, 132],
  [106, 118, 98, 126],
  [118, 92, 84, 124],
  [92, 104, 84, 112],
  [104, 78, 68, 110],
  [78, 90, 70, 98],
  [90, 60, 52, 94],
  [60, 74, 52, 82],
  [74, 50, 42, 80],
  [50, 62, 42, 70],
];

function Exchange() {
  return (
    <>
      {[14, 50, 86, 122].map((y) => (
        <line key={y} x1="4" y1={y} x2="252" y2={y} className={s.grid} />
      ))}
      {candles.map(([open, close, high, low], i) => {
        const x = 14 + i * 22;
        return (
          <g key={x} className={s.enter} style={delay(i * 0.09)}>
            <line x1={x} y1={high} x2={x} y2={low} className={s.wick} />
            <rect x={x - 7} y={Math.min(open, close)} width="14" height={Math.abs(open - close)} className={close < open ? s.rise : s.fall} />
          </g>
        );
      })}
      <line x1="236" y1="14" x2="236" y2="70" className={s.wick} />
      <rect x="229" y="22" width="14" height="40" className={`${s.rise} ${s.live}`} />
      <g className={s.mark}>
        <line x1="4" y1="62" x2="254" y2="62" className={s.markLine} />
        <rect x="254" y="53" width="64" height="18" rx="3" className={s.hub} />
        <text x="286" y="66" textAnchor="middle" className={s.tag}>
          Mark price
        </text>
      </g>
      <line x1="4" y1="148" x2="254" y2="148" className={`${s.wire} ${s.dash}`} />
      <rect x="254" y="139" width="64" height="18" rx="3" className={s.node} />
      <text x="286" y="152" textAnchor="middle" className={s.label}>
        Liquidation
      </text>
    </>
  );
}

function Stream() {
  return (
    <>
      <rect x="8" y="22" width="34" height="116" rx="6" className={s.node} />
      <rect x="278" y="22" width="34" height="116" rx="6" className={s.node} />
      <text x="25" y="154" textAnchor="middle" className={s.label}>
        Producer
      </text>
      <text x="292" y="154" textAnchor="middle" className={s.label}>
        Consumer
      </text>
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
      <line x1="40" y1="80" x2="280" y2="80" className={s.wire} />
      <Dot path="M40 80 L280 80" dur={3.2} r={3.5} />
      {["Commit", "Build", "Test", "Live"].map((stage, i) => {
        const x = 40 + i * 80;
        return (
          <g key={x}>
            <circle cx={x} cy="80" r="14" className={`${s.node} ${s.stage}`} style={delay(i * 0.8)} />
            <text x={x} y="114" textAnchor="middle" className={s.label}>
              {stage}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Ledger() {
  const bank = ["1,200", "860", "2,450", "40"];
  const books = ["860", "1,200", "2,450", "?"];
  const pairs = [
    [0, 1],
    [1, 0],
    [2, 2],
  ];
  const y = (i: number) => 38 + i * 30;
  return (
    <>
      <text x="56" y="16" textAnchor="middle" className={s.label}>
        Bank
      </text>
      <text x="264" y="16" textAnchor="middle" className={s.label}>
        Invoices
      </text>
      {bank.map((amount, i) => (
        <g key={i}>
          <rect x="8" y={y(i) - 10} width="96" height="20" rx="3" className={s.node} />
          <text x="56" y={y(i) + 4} textAnchor="middle" className={s.label}>
            $ {amount}
          </text>
          <rect x="216" y={y(i) - 10} width="96" height="20" rx="3" className={books[i] === "?" ? `${s.node} ${s.blink}` : s.node} />
          <text x="264" y={y(i) + 4} textAnchor="middle" className={s.label}>
            {books[i] === "?" ? "Review" : `$ ${books[i]}`}
          </text>
        </g>
      ))}
      <path d={`M104 ${y(3)} L216 ${y(3)}`} className={`${s.wire} ${s.dash}`} />
      {pairs.map(([from, to], i) => (
        <path key={i} d={`M104 ${y(from)} C160 ${y(from)} 160 ${y(to)} 216 ${y(to)}`} pathLength={1} className={s.match} style={delay(i * 0.5)} />
      ))}
    </>
  );
}

function Finance() {
  const line = "M14 126 L58 108 L102 116 L146 84 L190 92 L234 58 L278 46";
  return (
    <>
      {["CSV", "PDF", "Bank API"].map((t, i) => (
        <g key={t}>
          <rect x={14 + i * 66} y="8" width="58" height="20" rx="10" className={s.node} />
          <text x={43 + i * 66} y="22" className={s.label} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {[60, 94, 128].map((y) => (
        <line key={y} x1="14" y1={y} x2="306" y2={y} className={s.grid} />
      ))}
      <path d={`${line} L278 140 L14 140 Z`} className={`${s.area} ${s.fill}`} />
      <path d={line} pathLength={1} className={`${s.line} ${s.draw}`} />
      <circle cx="278" cy="46" r="4" className={s.hub} />
      <text x="278" y="36" textAnchor="middle" className={s.label}>
        Balance
      </text>
      <text x="14" y="154" className={s.label}>
        Jan
      </text>
      <text x="278" y="154" textAnchor="middle" className={s.label}>
        Today
      </text>
    </>
  );
}

function Chain() {
  return (
    <>
      {["Functions", "Automation", "Price feed"].map((t, i) => {
        const x = 120 + i * 80;
        return (
          <g key={t}>
            <text x={x} y="20" className={s.label} textAnchor="middle">
              {t}
            </text>
            <line x1={x} y1="28" x2={x} y2="62" className={`${s.wire} ${s.dash}`} />
            <Dot path={`M${x} 28 L${x} 62`} dur={2.4} begin={i * 0.8} r={2.2} muted />
          </g>
        );
      })}
      <line x1="40" y1="84" x2="280" y2="84" className={s.wire} />
      {["Bet", "Result", "Settle", "Payout"].map((t, i) => {
        const x = 40 + i * 80;
        return (
          <g key={t}>
            <rect x={x - 22} y="62" width="44" height="44" rx="6" className={`${s.node} ${s.solid} ${s.block}`} style={delay(i * 0.9)} />
            <text x={x} y="126" className={s.label} textAnchor="middle">
              {t}
            </text>
          </g>
        );
      })}
      <Dot path="M40 84 L280 84" dur={3.6} r={4} />
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
