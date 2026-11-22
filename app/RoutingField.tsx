"use client";

import { useEffect, useRef } from "react";

// Hero animation: requests (dots) flow from clients into a gateway and fan out to providers.
// Ambient dust drifts behind and moves away from the cursor. Click sends a burst of requests.

type Pt = { x: number; y: number };
type Req = { from: number; to: number; leg: 0 | 1; t: number; speed: number };
type Dust = Pt & { vx: number; vy: number; r: number };

const SODIUM = "244,184,96";
const IRIS = "140,158,255";
const HAZE = "141,144,166";
const BONE = "236,232,223";

function bez(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

export default function RoutingField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let sources: Pt[] = [];
    let providers: Pt[] = [];
    let gate: Pt = { x: 0, y: 0 };
    let dust: Dust[] = [];
    let flashes: number[] = [];
    let reqs: Req[] = [];
    let pulse = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let spawnAcc = 0;
    const born = last;
    const mouse = { x: -1e4, y: -1e4 };

    const inCurve = (i: number) => {
      const a = sources[i];
      return [a, { x: (a.x + gate.x) / 2, y: a.y }, gate] as const;
    };
    const outCurve = (i: number) => {
      const b = providers[i];
      return [gate, { x: (gate.x + b.x) / 2, y: b.y }, b] as const;
    };
    const curve = (r: Req) => (r.leg === 0 ? inCurve(r.from) : outCurve(r.to));

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const narrow = w < 760;
      // Desktop: graph on the right half, clear of the headline. Mobile: graph above it.
      const x0 = narrow ? 0.08 : 0.52;
      const top = narrow ? 0.1 : 0.16;
      const span = narrow ? 0.32 : 0.6;
      gate = { x: w * (narrow ? 0.56 : 0.74), y: h * (top + span / 2) };
      sources = Array.from({ length: 7 }, (_, i) => ({
        x: w * (x0 + 0.04 * Math.sin(i * 2.3)),
        y: h * (top + (i * span) / 6),
      }));
      providers = Array.from({ length: 5 }, (_, i) => ({
        x: w * 0.93,
        y: h * (top + 0.04 + (i * (span - 0.08)) / 4),
      }));
      flashes = providers.map(() => 0);
      const n = Math.min(160, Math.round((w * h) / 9000));
      dust = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.2 + 0.3,
      }));
    }

    // Weighted routing: the first provider takes most traffic, like a primary with fallbacks.
    const pickProvider = () => {
      const weights = [5, 3, 2, 1, 1];
      let x = Math.random() * 12;
      for (let i = 0; i < weights.length; i++) if ((x -= weights[i]) < 0) return i;
      return 0;
    };

    const spawn = (from = Math.floor(Math.random() * sources.length)) =>
      reqs.push({ from, to: pickProvider(), leg: 0, t: 0, speed: 0.35 + Math.random() * 0.25 });

    function stroke(a: Pt, c: Pt, b: Pt, upTo: number) {
      ctx!.beginPath();
      const steps = 32;
      for (let s = 0; s <= steps * upTo; s++) {
        const p = bez(a, c, b, s / steps);
        if (s === 0) ctx!.moveTo(p.x, p.y);
        else ctx!.lineTo(p.x, p.y);
      }
      ctx!.stroke();
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const intro = reduce ? 1 : Math.min((now - born) / 1600, 1);
      const ease = 1 - Math.pow(1 - intro, 3);
      ctx!.clearRect(0, 0, w, h);

      // Dust
      for (const d of dust) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 14400) {
          const f = (1 - Math.sqrt(dist2) / 120) * 0.6;
          d.vx += (dx / 120) * f;
          d.vy += (dy / 120) * f;
        }
        d.vx *= 0.96;
        d.vy *= 0.96;
        d.vx += (Math.random() - 0.5) * 0.01;
        d.vy += (Math.random() - 0.5) * 0.01;
        d.x = (d.x + d.vx + w) % w;
        d.y = (d.y + d.vy + h) % h;
        ctx!.fillStyle = `rgba(${BONE},${0.28 * ease})`;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Routes draw in on load: inbound first, outbound right after.
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = `rgba(${HAZE},0.22)`;
      const inP = Math.min(ease * 1.6, 1);
      const outP = Math.max(0, Math.min((ease - 0.45) / 0.55, 1));
      sources.forEach((_, i) => stroke(...inCurve(i), inP));
      if (outP > 0) providers.forEach((_, i) => stroke(...outCurve(i), outP));

      // Nodes
      for (const s of sources) {
        ctx!.strokeStyle = `rgba(${HAZE},${0.6 * inP})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx!.stroke();
      }
      providers.forEach((p, i) => {
        flashes[i] = Math.max(0, flashes[i] - dt * 2);
        ctx!.fillStyle = `rgba(${IRIS},${(0.35 + 0.65 * flashes[i]) * outP})`;
        ctx!.fillRect(p.x - 3.5, p.y - 3.5, 7, 7);
      });
      pulse = Math.max(0, pulse - dt * 2.5);
      if (intro > 0.3) {
        const g = Math.min((intro - 0.3) / 0.3, 1);
        ctx!.strokeStyle = `rgba(${SODIUM},${(1 - pulse) * 0.5 * g})`;
        ctx!.beginPath();
        ctx!.arc(gate.x, gate.y, 9 + pulse * 18, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.fillStyle = `rgba(${SODIUM},${g})`;
        ctx!.beginPath();
        ctx!.arc(gate.x, gate.y, 5, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Requests
      if (intro >= 1 && !reduce) {
        spawnAcc += dt;
        while (spawnAcc > 0.16) {
          spawnAcc -= 0.16;
          spawn();
        }
      }
      reqs = reqs.filter((r) => {
        if (!reduce) r.t += r.speed * dt;
        if (r.t >= 1) {
          if (r.leg === 1) {
            flashes[r.to] = 1;
            return false;
          }
          r.leg = 1;
          r.t = 0;
          pulse = 1;
        }
        const c = curve(r);
        const rgb = r.leg === 0 ? SODIUM : IRIS;
        for (let k = 5; k >= 0; k--) {
          const p = bez(...c, Math.max(0, r.t - k * 0.018));
          ctx!.fillStyle = `rgba(${rgb},${k === 0 ? 0.95 : 0.35 * (1 - k / 6)})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, k === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
          ctx!.fill();
        }
        return true;
      });

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }

    layout();
    if (reduce) {
      // Still frame: a few requests caught mid-flight.
      for (let i = 0; i < 10; i++) {
        spawn();
        reqs[i].leg = (i % 2) as 0 | 1;
        reqs[i].t = Math.random() * 0.9;
      }
    }
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onDown = (e: PointerEvent) => {
      if (reduce || (e.target as HTMLElement).closest("a,button")) return;
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      if (y > h) return;
      // Burst from the client nearest the click, vertically.
      let best = 0;
      sources.forEach((s, i) => {
        if (Math.abs(s.y - y) < Math.abs(sources[best].y - y)) best = i;
      });
      for (let i = 0; i < 14; i++) setTimeout(() => spawn(best), i * 45);
    };
    const ro = new ResizeObserver(() => {
      layout();
      reqs = [];
      if (reduce) frame(performance.now());
    });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    });
    ro.observe(canvas);
    io.observe(canvas);
    addEventListener("pointermove", onMove);
    addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
