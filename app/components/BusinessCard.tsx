"use client";

import s from "./BusinessCard.module.css";

export const tilt = {
  onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  },
  onPointerLeave(e: React.PointerEvent<HTMLElement>) {
    for (const p of ["--rx", "--ry", "--gx", "--gy"]) e.currentTarget.style.removeProperty(p);
  },
};

export default function BusinessCard({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={`${s.card} ${className}`} {...tilt}>
      {children}
      <span className={s.sheen} aria-hidden="true" />
    </div>
  );
}
