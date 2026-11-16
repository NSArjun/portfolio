"use client";

import { useEffect } from "react";

/** Adds `.is-in` once to every `.rv` / `.rv-mask` element as it enters the viewport. */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    document.querySelectorAll(".rv, .rv-mask").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
