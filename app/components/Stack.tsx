"use client";

import { useRef, useState } from "react";
import { orbits, stack, techNotes } from "../content";
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

const moving = () => !document.documentElement.dataset.motion && !matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Stack() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [link, setLink] = useState<Link>(null);
  const orbit = useRef<SVGSVGElement>(null);
  const timer = useRef(0);

  const later = (e: React.PointerEvent, hide: () => void) => {
    clearTimeout(timer.current);
    if (e.pointerType === "touch") timer.current = window.setTimeout(hide, 2200);
    else hide();
  };

  const show = (name: string, el: Element) => {
    clearTimeout(timer.current);
    const r = el.getBoundingClientRect();
    setTip({ name, x: r.left + r.width / 2, y: r.top });
  };

  const enterOrbit = (name: string, el: SVGGElement) => {
    const svg = orbit.current;
    const m = svg?.getScreenCTM()?.inverse();
    if (!svg || !m) return;
    svg.pauseAnimations();
    const r = el.querySelector(`.${s.badge}`)!.getBoundingClientRect();
    const p = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(m);
    setLink({ x: p.x, y: p.y });
    show(name, el);
  };

  const leaveOrbit = () => {
    if (moving()) orbit.current?.unpauseAnimations();
    setLink(null);
    setTip(null);
  };

  return (
    <section id="stack" className={`panel ${s.stack}`} data-live>
      <h2 className="title reveal">Stack</h2>
      <div className={s.grid}>
        <svg ref={orbit} className={s.orbit} viewBox="-285 -252 570 527" aria-hidden="true">
          {link && <line x1="0" y1="0" x2={link.x} y2={link.y} className={s.link} />}
          <circle r="40" className={s.core} />
          <circle r="40" className={s.halo} />
          <path d="M-16 -9 Q-6 -9 0 0 M-16 9 Q-6 9 0 0 M0 0 Q6 -9 16 -9 M0 0 Q6 9 16 9" className={s.mark} />
          <circle r="4" className={s.hub} />
          {orbits.map((ring, k) => {
            const r = 92 + k * 66;
            const dur = 50 + k * 25;
            const sweep = k % 2;
            const path = `M${r} 0 A${r} ${r} 0 1 ${sweep} ${-r} 0 A${r} ${r} 0 1 ${sweep} ${r} 0`;
            return (
              <g key={k}>
                <circle r={r} className={s.path} />
                {ring.map((name, i) => (
                  <g key={name} className={s.item} style={brand(name)} onPointerEnter={(e) => enterOrbit(name, e.currentTarget)} onPointerLeave={(e) => later(e, leaveOrbit)}>
                    <animateMotion dur={`${dur}s`} begin={`-${((i / ring.length) * dur).toFixed(2)}s`} repeatCount="indefinite" path={path} />
                    <circle r="22" className={s.hit} />
                    <g className={s.body}>
                      <circle r="15" className={s.badge} />
                      {icons[name] ? <path d={icons[name].path} transform="translate(-9 -9) scale(0.75)" className={s.icon} /> : <circle r="3" className={s.hub} />}
                      <text y="29" textAnchor="middle" className={s.label}>
                        {name}
                      </text>
                    </g>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
        <dl className={s.list}>
          {stack.map(([group, tools], i) => (
            <div key={group} className="reveal" style={{ "--i": i + 1 } as React.CSSProperties}>
              <dt>{group}</dt>
              <dd>
                {tools.map((t) => (
                  <span
                    key={t}
                    className={s.chip}
                    style={brand(t)}
                    tabIndex={0}
                    aria-describedby={tip?.name === t ? "tech-tip" : undefined}
                    onPointerEnter={(e) => show(t, e.currentTarget)}
                    onPointerLeave={(e) => later(e, () => setTip(null))}
                    onFocus={(e) => show(t, e.currentTarget)}
                    onBlur={() => setTip(null)}
                  >
                    <TechIcon name={t} size={15} />
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {tip && (
        <div id="tech-tip" role="tooltip" className={s.tip} style={{ left: tip.x, top: tip.y, ...brand(tip.name) }}>
          <strong>{tip.name}</strong>
          {techNotes[tip.name]}
        </div>
      )}
    </section>
  );
}
