"use client";

import { RefObject, useEffect, useState } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once (or while) the element intersects the viewport. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, threshold = 0.2, rootMargin = "0px" }: { once?: boolean; threshold?: number; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold, rootMargin]);
  return inView;
}

/**
 * Calls `onProgress` (0 → 1) as the element scrolls through the viewport.
 * `start`/`end` are viewport fractions: progress is 0 when the element's top
 * hits `start * innerHeight`, 1 when its bottom hits `end * innerHeight`.
 * Writes happen inside requestAnimationFrame; no React re-render per frame.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (p: number, el: T) => void,
  { start = 1, end = 0 }: { start?: number; end?: number } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start;
      const to = vh * end - r.height;
      const p = (from - r.top) / (from - to);
      onProgress(Math.min(1, Math.max(0, p)), el);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, [ref, onProgress, start, end]);
}
