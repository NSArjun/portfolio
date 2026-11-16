"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Smoothly scroll to a selector, element or pixel offset (falls back to native scroll). */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (typeof target === "string" && el instanceof HTMLElement) {
    history.replaceState(null, "", target.startsWith("#") ? target : location.pathname);
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return <>{children}</>;
}
