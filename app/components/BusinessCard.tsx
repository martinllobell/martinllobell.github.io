"use client";

import s from "./BusinessCard.module.css";

export default function BusinessCard({ children, className }: { children: React.ReactNode; className: string }) {
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    for (const p of ["--rx", "--ry", "--gx", "--gy"]) e.currentTarget.style.removeProperty(p);
  };
  return (
    <div className={`${s.card} ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <span className={s.sheen} aria-hidden="true" />
    </div>
  );
}
