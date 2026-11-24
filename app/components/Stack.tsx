"use client";

import { useEffect, useRef, useState } from "react";
import { orbits, techNotes } from "../content";
import TechIcon, { icons } from "./TechIcon";
import Sculpture from "./Sculpture";
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
  const rings = [0.43, 0.71, 1].map((k) => [k * (w / 2 - 34), k * (h / 2 - 40)]);
  return { viewBox: `${-w / 2} ${-h / 2 - 6} ${w} ${h}`, rings };
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

  const release = useRef<() => void>(undefined);

  const enterOrbit = (name: string, el: SVGGElement) => {
    const svg = orbit.current;
    const scale = svg?.getScreenCTM()?.a;
    if (!svg || !scale) return;
    clearTimeout(timer.current);
    release.current?.();
    const hold = el.querySelector<SVGGElement>(`.${s.hold}`)!;
    const anchor = el.querySelector(`.${s.anchor}`)!;
    const at = (node: Element) => {
      const r = node.getBoundingClientRect();
      const o = svg.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - o.left) / scale, y: (r.top + r.height / 2 - o.top) / scale };
    };
    const start = at(el.querySelector(`.${s.badge}`)!);
    let frame = 0;
    const stay = () => {
      const p = at(anchor);
      hold.style.translate = `${start.x - p.x}px ${start.y - p.y}px`;
      frame = requestAnimationFrame(stay);
    };
    hold.style.transition = "none";
    stay();
    release.current = () => {
      cancelAnimationFrame(frame);
      hold.style.transition = "";
      hold.style.translate = "";
      release.current = undefined;
    };
    const { x, y } = svg.viewBox.baseVal;
    setLink({ x: start.x + x, y: start.y + y });
    const box = el.querySelector(`.${s.hit}`)!.getBoundingClientRect();
    setTip({ name, x: box.left + box.width / 2, y: box.top });
  };

  const leaveOrbit = () => {
    clearTimeout(timer.current);
    release.current?.();
    setLink(null);
    setTip(null);
  };

  useEffect(() => {
    const resize = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width && height) setLayout(fit(width, height));
    });
    resize.observe(orbit.current!);
    const away = (e: Event) => {
      if (!(e.target instanceof Element && e.target.closest(`.${s.item}`))) leaveOrbit();
    };
    addEventListener("pointerdown", away, { passive: true });
    addEventListener("scroll", away, { passive: true });
    return () => {
      resize.disconnect();
      removeEventListener("pointerdown", away);
      removeEventListener("scroll", away);
      clearTimeout(timer.current);
      release.current?.();
    };
  }, []);

  return (
    <section id="stack" className={`panel ${s.stack}`} data-live>
      <h2 className="title reveal">Stack</h2>
      <div className={s.tree} data-parallax="10">
        <Sculpture shape="planet" className={s.nucleus} />
        <svg ref={orbit} className={s.orbit} viewBox={layout.viewBox} role="group" aria-label="Technologies I work with" onPointerMove={drift} onPointerLeave={settle}>
          {link && <line x1="0" y1="0" x2={link.x} y2={link.y} className={s.link} />}
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
                  data-on={tip?.name === name || undefined}
                    style={brand(name)}
                    tabIndex={0}
                    role="img"
                    aria-label={`${name}: ${techNotes[name]}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && enterOrbit(name, e.currentTarget)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && leaveOrbit()}
                  onClick={(e) => {
                    if (!matchMedia("(hover: none)").matches) return;
                    if (tip?.name === name) return leaveOrbit();
                    enterOrbit(name, e.currentTarget);
                    timer.current = window.setTimeout(leaveOrbit, 3500);
                  }}
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && enterOrbit(name, e.currentTarget)}
                  onBlur={leaveOrbit}
                    onKeyDown={(e) => e.key === "Escape" && leaveOrbit()}
                  >
                    <animateMotion dur={`${dur}s`} begin={`-${((i / ring.length) * dur).toFixed(2)}s`} repeatCount="indefinite" path={path} />
                    <circle r="1" className={s.anchor} />
                    <g className={s.hold}>
                      <circle r="22" className={s.hit} />
                      <g className={s.body}>
                        <circle r="17" className={s.badge} />
                        {icons[name] ? (
                          <path d={icons[name].path} transform="translate(-10 -10) scale(0.8333)" className={s.icon} />
                        ) : (
                          <text y="4" textAnchor="middle" className={s.mono}>
                            {name.length > 4 ? name.slice(0, 2) : name}
                          </text>
                        )}
                        <text y="31" textAnchor="middle" className={s.label}>
                          {name}
                        </text>
                      </g>
                    </g>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      {tip && (
        <div aria-hidden="true" className={s.tip} style={{ left: `clamp(8.75rem, ${tip.x}px, calc(100vw - 8.75rem))`, top: tip.y, ...brand(tip.name) }}>
          <strong>{tip.name}</strong>
          {techNotes[tip.name]}
        </div>
      )}
    </section>
  );
}
