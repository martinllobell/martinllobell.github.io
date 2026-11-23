"use client";

import { useEffect } from "react";

export const effects: { current?: typeof import("./effects") } = {};

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;
    let gone = false;
    const off = () => gone || reduced.matches || !!root.dataset.motion;
    const sync = async () => {
      stop?.();
      stop = undefined;
      if (off()) return;
      await document.fonts.ready;
      effects.current ??= await import("./effects");
      if (!off() && !stop) stop = effects.current.animate();
    };
    const follow = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || off()) return;
      for (const el of document.querySelectorAll<SVGElement>(".is-live > .guilloche")) {
        el.style.setProperty("--cx", String((e.clientX / innerWidth) * 2 - 1));
        el.style.setProperty("--cy", String((e.clientY / innerHeight) * 2 - 1));
      }
    };
    sync();
    const watch = new MutationObserver(sync);
    watch.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    reduced.addEventListener("change", sync);
    addEventListener("pointermove", follow, { passive: true });
    return () => {
      gone = true;
      stop?.();
      watch.disconnect();
      reduced.removeEventListener("change", sync);
      removeEventListener("pointermove", follow);
    };
  }, []);

  return null;
}
