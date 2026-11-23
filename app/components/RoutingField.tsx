"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };
type Req = { from: number; to: number; leg: 0 | 1; t: number; speed: number };
type Dust = Pt & { vx: number; vy: number; r: number };

const weights = [5, 3, 2, 1, 1];

const bez = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

const pickProvider = () => {
  let x = Math.random() * 12;
  return Math.max(0, weights.findIndex((w) => (x -= w) < 0));
};

export default function RoutingField({ className }: { className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -1e4, y: -1e4 };
    const pull = { x: 0, y: 0, k: 0 };
    const color = { ink: "", accent: "" };
    let w = 0;
    let h = 0;
    let gate: Pt = { x: 0, y: 0 };
    let sources: Pt[] = [];
    let providers: Pt[] = [];
    let flashes: number[] = [];
    let dust: Dust[] = [];
    let reqs: Req[] = [];
    let pulse = 0;
    let raf = 0;
    let visible = true;
    let spawnAcc = 0;
    let last = performance.now();
    const born = last;

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      color.ink = css.getPropertyValue("--ink-rgb").trim();
      color.accent = css.getPropertyValue("--accent-rgb").trim();
    };

    const bend = (x: number, y: number): Pt => {
      const dx = pull.x - x;
      const dy = pull.y - y;
      const f = pull.k * Math.exp(-(dx * dx + dy * dy) / (w * w * 0.05));
      return { x: x + dx * f * 0.5, y: y + dy * f };
    };
    const inCurve = (i: number) => [sources[i], bend((sources[i].x + gate.x) / 2, sources[i].y), gate] as const;
    const outCurve = (i: number) => [gate, bend((gate.x + providers[i].x) / 2, providers[i].y), providers[i]] as const;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const span = w < 760 ? 0.24 : 0.22;
      gate = { x: w * 0.5, y: h * (0.1 + span / 2) };
      sources = Array.from({ length: 7 }, (_, i) => ({ x: w * (0.05 + 0.025 * Math.sin(i * 2.3)), y: h * (0.1 + (i * span) / 6) }));
      providers = Array.from({ length: 5 }, (_, i) => ({ x: w * 0.95, y: h * (0.12 + (i * (span - 0.04)) / 4) }));
      flashes = providers.map(() => 0);
      dust = Array.from({ length: Math.min(140, Math.round((w * h) / 10000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.1 + 0.3,
      }));
      reqs = [];
    };

    const spawn = (from = Math.floor(Math.random() * sources.length)) =>
      reqs.push({ from, to: pickProvider(), leg: 0, t: still ? Math.random() * 0.9 : 0, speed: 0.35 + Math.random() * 0.25 });

    const stroke = (a: Pt, c: Pt, b: Pt, upTo: number) => {
      ctx.beginPath();
      for (let s = 0; s <= 32 * upTo; s++) {
        const p = bez(a, c, b, s / 32);
        if (s === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    };

    const circle = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
    };

    const drawDust = (ease: number) => {
      ctx.fillStyle = `rgba(${color.ink},${0.22 * ease})`;
      for (const d of dust) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const f = (1 - dist / 120) * 0.6;
          d.vx += (dx / 120) * f;
          d.vy += (dy / 120) * f;
        }
        d.vx = d.vx * 0.96 + (Math.random() - 0.5) * 0.01;
        d.vy = d.vy * 0.96 + (Math.random() - 0.5) * 0.01;
        d.x = (d.x + d.vx + w) % w;
        d.y = (d.y + d.vy + h) % h;
        circle(d.x, d.y, d.r);
        ctx.fill();
      }
    };

    const drawGraph = (intro: number, ease: number, dt: number) => {
      const inP = Math.min(ease * 1.6, 1);
      const outP = Math.max(0, Math.min((ease - 0.45) / 0.55, 1));
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${color.ink},0.14)`;
      sources.forEach((_, i) => stroke(...inCurve(i), inP));
      if (outP > 0) providers.forEach((_, i) => stroke(...outCurve(i), outP));
      ctx.strokeStyle = `rgba(${color.ink},${0.45 * inP})`;
      for (const p of sources) {
        circle(p.x, p.y, 3);
        ctx.stroke();
      }
      providers.forEach((p, i) => {
        flashes[i] = Math.max(0, flashes[i] - dt * 2);
        ctx.fillStyle = `rgba(${color.accent},${(0.3 + 0.7 * flashes[i]) * outP})`;
        ctx.fillRect(p.x - 3.5, p.y - 3.5, 7, 7);
      });
      pulse = Math.max(0, pulse - dt * 2.5);
      const g = Math.min(Math.max((intro - 0.3) / 0.3, 0), 1);
      ctx.strokeStyle = `rgba(${color.accent},${(1 - pulse) * 0.5 * g})`;
      circle(gate.x, gate.y, 9 + pulse * 18);
      ctx.stroke();
      ctx.fillStyle = `rgba(${color.accent},${g})`;
      circle(gate.x, gate.y, 5);
      ctx.fill();
    };

    const drawRequests = (dt: number) => {
      reqs = reqs.filter((r) => {
        if (!still) r.t += r.speed * dt;
        if (r.t >= 1) {
          if (r.leg === 1) {
            flashes[r.to] = 1;
            return false;
          }
          r.leg = 1;
          r.t = 0;
          pulse = 1;
          canvas.dispatchEvent(new Event("gate", { bubbles: true }));
        }
        const c = r.leg === 0 ? inCurve(r.from) : outCurve(r.to);
        const rgb = r.leg === 0 ? color.accent : color.ink;
        for (let k = 5; k >= 0; k--) {
          const p = bez(...c, Math.max(0, r.t - k * 0.018));
          ctx.fillStyle = `rgba(${rgb},${k === 0 ? 0.9 : 0.3 * (1 - k / 6)})`;
          circle(p.x, p.y, k === 0 ? 2.2 : 1.6);
          ctx.fill();
        }
        return true;
      });
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const inside = mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h;
      pull.k += ((inside && !document.documentElement.dataset.motion ? 0.9 : 0) - pull.k) * Math.min(1, dt * 4);
      if (inside) {
        pull.x += (mouse.x - pull.x) * Math.min(1, dt * 6);
        pull.y += (mouse.y - pull.y) * Math.min(1, dt * 6);
      }
      const intro = still ? 1 : Math.min((now - born) / 1600, 1);
      const ease = 1 - Math.pow(1 - intro, 3);
      ctx.clearRect(0, 0, w, h);
      drawDust(ease);
      drawGraph(intro, ease, dt);
      if (intro >= 1 && !still) {
        spawnAcc += dt;
        for (; spawnAcc > 0.16; spawnAcc -= 0.16) spawn();
      }
      drawRequests(dt);
      if (!still && visible && document.documentElement.dataset.motion !== "paused") raf = requestAnimationFrame(frame);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const onDown = (e: PointerEvent) => {
      if (still || (e.target as HTMLElement).closest("a,button")) return;
      const y = e.clientY - canvas.getBoundingClientRect().top;
      if (y < 0 || y > h) return;
      const nearest = sources.reduce((best, s, i) => (Math.abs(s.y - y) < Math.abs(sources[best].y - y) ? i : best), 0);
      for (let i = 0; i < 14; i++) setTimeout(() => spawn(nearest), i * 45);
    };

    const reset = () => {
      layout();
      if (still) for (let i = 0; i < 10; i++) spawn();
      restart();
    };

    readColors();
    reset();

    const resize = new ResizeObserver(reset);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !still) restart();
    });
    const theme = new MutationObserver(() => {
      readColors();
      restart();
    });
    resize.observe(canvas);
    seen.observe(canvas);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-motion"] });
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      theme.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
