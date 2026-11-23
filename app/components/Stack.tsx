"use client";

import { useEffect, useRef, useState } from "react";
import { orbits, techNotes } from "../content";
import TechIcon, { icons } from "./TechIcon";
import s from "./Stack.module.css";

type Tip = { name: string; x: number; y: number };
type Link = { x: number; y: number } | null;

const luminance = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const brand = (name: string) => {
  const hex = icons[name]?.hex;
  return hex ? ({ "--brand": `#${hex}`, "--brand-dark": luminance(hex) < 0.25 ? "var(--ink)" : `#${hex}` } as React.CSSProperties) : undefined;
};

const fit = (width: number, height: number) => {
  const scale = Math.min(width / 400, height / 520, 1.4);
  const [w, h] = [width / scale, height / scale];
  const rings = [0.42, 0.71, 1].map((k) => [k * (w / 2 - 34), k * (h / 2 - 40)]);
  return { viewBox: `${-w / 2} ${-h / 2 - 6} ${w} ${h}`, rings, core: Math.min(1, Math.min(...rings[0]) / 100) };
};

const moving = () => !document.documentElement.dataset.motion && !matchMedia("(prefers-reduced-motion: reduce)").matches;

const drift = (e: React.PointerEvent<SVGSVGElement>) => {
  if (e.pointerType !== "mouse" || !moving()) return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
  e.currentTarget.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
};

const settle = (e: React.PointerEvent<SVGSVGElement>) => {
  e.currentTarget.style.removeProperty("--mx");
  e.currentTarget.style.removeProperty("--my");
};

export default function Stack() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [link, setLink] = useState<Link>(null);
  const [layout, setLayout] = useState(() => fit(1000, 520));
  const orbit = useRef<SVGSVGElement>(null);
  const timer = useRef(0);

  const enterOrbit = (name: string, el: SVGGElement) => {
    const svg = orbit.current;
    const m = svg?.getScreenCTM()?.inverse();
    if (!svg || !m) return;
    clearTimeout(timer.current);
    svg.pauseAnimations();
    const r = el.querySelector(`.${s.badge}`)!.getBoundingClientRect();
    const p = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(m);
    setLink({ x: p.x, y: p.y });
    const box = el.getBoundingClientRect();
    setTip({ name, x: box.left + box.width / 2, y: box.top });
  };

  const leaveOrbit = () => {
    clearTimeout(timer.current);
    if (moving() && orbit.current?.closest(".is-live")) orbit.current.unpauseAnimations();
    setLink(null);
    setTip(null);
  };

  useEffect(() => {
    const resize = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width && height) setLayout(fit(width, height));
    });
    resize.observe(orbit.current!);
    return () => {
      resize.disconnect();
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <section id="stack" className={`panel ${s.stack}`} data-live>
      <span className="ghost" aria-hidden="true">
        Toolbox
      </span>
      <h2 className="title reveal">Stack</h2>
      <svg ref={orbit} className={s.orbit} viewBox={layout.viewBox} role="group" aria-label="Technologies I work with" data-parallax="10" onPointerMove={drift} onPointerLeave={settle}>
        {link && <line x1="0" y1="0" x2={link.x} y2={link.y} className={s.link} />}
        <g transform={`scale(${layout.core})`}>
          <circle r="40" className={s.core} />
          <circle r="40" className={s.halo} />
          <path d="M-16 -9 Q-6 -9 0 0 M-16 9 Q-6 9 0 0 M0 0 Q6 -9 16 -9 M0 0 Q6 9 16 9" className={s.mark} />
          <circle r="4" className={s.hub} />
        </g>
        {orbits.map((ring, k) => {
          const [rx, ry] = layout.rings[k];
          const dur = 60 + k * 30;
          const sweep = k % 2;
          const path = `M${rx} 0 A${rx} ${ry} 0 1 ${sweep} ${-rx} 0 A${rx} ${ry} 0 1 ${sweep} ${rx} 0`;
          return (
            <g key={k} className={s.ring} style={{ "--k": k + 1 } as React.CSSProperties}>
              <ellipse rx={rx} ry={ry} className={s.path} />
              {ring.map((name, i) => (
                <g
                  key={name}
                  className={s.item}
                  style={brand(name)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${name}: ${techNotes[name]}`}
                  onPointerEnter={(e) => enterOrbit(name, e.currentTarget)}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "touch") timer.current = window.setTimeout(leaveOrbit, 2200);
                    else leaveOrbit();
                  }}
                  onFocus={(e) => enterOrbit(name, e.currentTarget)}
                  onBlur={leaveOrbit}
                  onKeyDown={(e) => e.key === "Escape" && leaveOrbit()}
                >
                  <animateMotion dur={`${dur}s`} begin={`-${((i / ring.length) * dur).toFixed(2)}s`} repeatCount="indefinite" path={path} />
                  <circle r="22" className={s.hit} />
                  <g className={s.body}>
                    <circle r="17" className={s.badge} />
                    {icons[name] ? (
                      <path d={icons[name].path} transform="translate(-10 -10) scale(0.8333)" className={s.icon} />
                    ) : (
                      <text y="4" textAnchor="middle" className={s.mono}>
                        {name.length > 4 ? name[0] : name}
                      </text>
                    )}
                    <text y="31" textAnchor="middle" className={s.label}>
                      {name}
                    </text>
                  </g>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      {tip && (
        <div aria-hidden="true" className={s.tip} style={{ left: `clamp(8.75rem, ${tip.x}px, calc(100vw - 8.75rem))`, top: tip.y, ...brand(tip.name) }}>
          <strong>{tip.name}</strong>
          {techNotes[tip.name]}
        </div>
      )}
    </section>
  );
}
