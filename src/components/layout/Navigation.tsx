"use client";

import { MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const css = `
@layer components {
.nv-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:60;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);pointer-events:none}
.nv{position:fixed;inset:14px 0 auto 0;z-index:50;pointer-events:none}
.nv-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
.nv-brand{pointer-events:auto;display:flex;align-items:center;gap:12px;height:48px;border-radius:999px}
.nv-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-family:var(--font-mono);font-size:13px;font-weight:600;letter-spacing:-.02em;box-shadow:inset 0 0 0 1.5px var(--ink);color:var(--ink);background:transparent;transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nv-brand:hover .nv-mark{transform:rotate(360deg)}
.nv.is-scrolled .nv-mark{background:var(--ink);color:var(--on-ink)}
.nv-name{font-weight:600;letter-spacing:-.02em;font-size:15px;transition:opacity .5s var(--ease),transform .6s var(--ease)}
.nv.is-scrolled .nv-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nv-pill{pointer-events:auto;position:relative;display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s var(--ease)}
.nv.is-scrolled .nv-pill{background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.25)}
.nv-ind{position:absolute;top:5px;left:0;height:38px;border-radius:999px;background:var(--ink);transform:translateX(var(--x,0));width:var(--w,0);opacity:var(--o,0);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s var(--ease);pointer-events:none}
.nv-link{position:relative;z-index:1;height:38px;display:inline-flex;align-items:center;padding-inline:15px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
.nv-link:hover{color:var(--ink)}
.nv-link[aria-current="true"]{color:var(--on-ink)}
.nv-menu{display:none;pointer-events:auto;height:44px;padding-inline:20px;border-radius:999px;background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line);font-size:14px;font-weight:500;align-items:center;gap:10px}
.nv-menu i{display:block;width:16px;height:1.5px;background:currentColor;position:relative}
.nv-menu i::after{content:"";position:absolute;left:0;top:5px;width:10px;height:1.5px;background:currentColor}
.nv-over{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0% at calc(100% - 52px) 36px);transition:clip-path .9s var(--ease),visibility 0s .9s;visibility:hidden;display:flex;flex-direction:column}
.nv-over.is-open{clip-path:circle(150% at calc(100% - 52px) 36px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.nv-over-top{display:flex;justify-content:space-between;align-items:center;padding:14px var(--gutter)}
.nv-close{height:44px;padding-inline:20px;border-radius:999px;background:var(--ink);color:var(--on-ink);font-size:14px;font-weight:500}
.nv-list{list-style:none;margin:auto 0;padding:0 var(--gutter);display:flex;flex-direction:column;gap:4px}
.nv-big{display:flex;align-items:baseline;gap:14px;font-size:clamp(40px,11vw,72px);font-weight:700;letter-spacing:-.045em;line-height:1.08;opacity:0;transform:translateY(40px);transition:opacity .6s var(--ease),transform .8s var(--ease)}
.nv-big small{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute-2)}
.nv-over.is-open .nv-big{opacity:1;transform:none;transition-delay:calc(.18s + var(--i) * 60ms)}
.nv-foot{padding:24px var(--gutter);font-size:14px;color:var(--mute-2);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.nv-actions{display:flex;align-items:center;gap:8px;pointer-events:auto}
.nv-navgrp{display:flex}
.nv-theme{position:relative;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line-2);transition:background-color .5s var(--ease),box-shadow .5s var(--ease),transform .5s var(--ease)}
.nv-theme:hover{transform:rotate(-12deg) scale(1.05);box-shadow:inset 0 0 0 1px var(--ink)}
.nv.is-scrolled .nv-theme{background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.25)}
.nv-theme svg{width:20px;height:20px;overflow:visible}
.nv-sun,.nv-moon{transform-origin:12px 12px;transition:transform .7s var(--ease),opacity .4s var(--ease)}
.nv-sun{opacity:0;transform:rotate(-90deg) scale(.5)}
[data-theme="dark"] .nv-sun{opacity:1;transform:none}
[data-theme="dark"] .nv-moon{opacity:0;transform:rotate(90deg) scale(.5)}
@media (max-width:899px){.nv-pill{display:none}.nv-menu{display:inline-flex}.nv-theme{width:44px;height:44px;background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}}
}
`;

const ids = NAV.map((n) => n.id);

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      setScrolled(scrollY > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const hero = document.getElementById("top");
    if (hero) {
      const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
        rootMargin: "-45% 0px -50% 0px",
      });
      heroIo.observe(hero);
      return () => {
        io.disconnect();
        heroIo.disconnect();
      };
    }
    return () => io.disconnect();
  }, []);

  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const link = active ? pill.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      pill.style.setProperty("--o", "0");
      return;
    }
    pill.style.setProperty("--x", `${link.offsetLeft}px`);
    pill.style.setProperty("--w", `${link.offsetWidth}px`);
    pill.style.setProperty("--o", "1");
  }, [active]);

  useLayoutEffect(() => {
    placeIndicator();
    addEventListener("resize", placeIndicator);
    return () => removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  useEffect(() => {
    if (!open) return;
    const btn = menuBtn.current;
    lockScroll(true);
    const t = setTimeout(() => firstLink.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      removeEventListener("keydown", onKey);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setTimeout(() => scrollToTarget(hash), 60);
    } else scrollToTarget(hash);
  };

  return (
    <>
      <style href="nav" precedence="medium">
        {css}
      </style>
      <div ref={barRef} className="nv-progress" aria-hidden="true" />
      <header className={`nv ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap nv-row">
          <a href="#top" className="nv-brand" onClick={(e) => go(e, "#top")}>
            <span className="nv-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nv-name">{PROFILE.name}</span>
            <span className="sr-only">, back to top</span>
          </a>
          <div className="nv-actions">
          <nav aria-label="Primary" className="nv-navgrp">
            <div ref={pillRef} className="nv-pill">
              <span className="nv-ind" aria-hidden="true" />
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  data-id={n.id}
                  className="nv-link"
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={(e) => go(e, `#${n.id}`)}
                >
                  {n.label}
                </a>
              ))}
            </div>
            <button
              ref={menuBtn}
              type="button"
              className="nv-menu"
              aria-expanded={open}
              aria-controls="nv-overlay"
              onClick={() => setOpen(true)}
            >
              <i aria-hidden="true" /> Menu
            </button>
          </nav>
          <ThemeToggle />
          </div>
        </div>
      </header>
      <div
        id="nv-overlay"
        className={`nv-over ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="nv-over-top">
          <span className="nv-name" style={{ fontSize: 15 }}>
            {PROFILE.name}
          </span>
          <button type="button" className="nv-close" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <ul className="nv-list">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a
                ref={i === 0 ? firstLink : undefined}
                href={`#${n.id}`}
                className="nv-big"
                style={{ ["--i" as string]: i }}
                onClick={(e) => go(e, `#${n.id}`)}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nv-foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          {PROFILE.location && <span>{PROFILE.location}</span>}
        </div>
      </div>
    </>
  );
}
