"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
@layer components {
.hr{position:relative;min-height:100svh;overflow:hidden;isolation:isolate;background:var(--paper)}
.hr-ghost{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);z-index:-1;font-weight:800;font-size:clamp(120px,27vw,460px);line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.2px var(--ghost);white-space:nowrap;user-select:none;pointer-events:none;animation:hr-ghost 1.6s var(--ease) both}
@keyframes hr-ghost{from{opacity:0;letter-spacing:.02em}to{opacity:1}}
.hr-stage{position:absolute;left:50%;bottom:0;height:min(96svh,1040px);aspect-ratio:768/960;transform:translateX(-50%);z-index:0;mix-blend-mode:multiply;-webkit-mask-image:linear-gradient(#000 82%,transparent 99%);mask-image:linear-gradient(#000 82%,transparent 99%)}
.hr-stage{animation:hr-rise 1.4s var(--ease) both .1s}
.hr-video{width:100%;height:100%;object-fit:cover;display:block}
@keyframes hr-rise{from{opacity:0;translate:0 40px;scale:.98}to{opacity:1;translate:0 0;scale:1}}
.hr-left,.hr-right{position:absolute;z-index:2;bottom:clamp(40px,9vh,96px)}
.hr-left{left:var(--gutter);max-width:min(36vw,520px)}
.hr-right{right:var(--gutter);max-width:300px;display:flex;flex-direction:column;align-items:flex-end;gap:18px;text-align:right}
.hr-eyebrow{display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute-2)}
.hr-eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px rgba(13,13,13,.08)}
.hr-h1{margin-top:18px;font-weight:700;letter-spacing:-.045em;line-height:.98;font-size:clamp(40px,4.8vw,84px)}
.hr-h1 .rv-mask>span{animation:hr-line 1.2s var(--ease) both .15s}
.hr-h1 .rv-mask:nth-child(2)>span{animation-delay:.27s}
.hr-h1 .rv-mask:nth-child(3)>span{animation-delay:.39s}
@keyframes hr-line{from{transform:translateY(105%)}}
.hr-in{animation:hr-in 1.1s var(--ease) both;animation-delay:calc(.45s + var(--i,0) * 90ms)}
@keyframes hr-in{from{opacity:0;transform:translateY(20px)}}
.hr-ctas{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end}
.hr-note{font-size:14px;line-height:1.5;color:var(--mute-2)}
.hr-sound{position:absolute;z-index:3;left:50%;bottom:clamp(40px,9vh,96px);transform:translateX(-50%);width:46px;height:46px;border-radius:50%;background:var(--ink);color:var(--on-ink);display:grid;place-items:center;box-shadow:0 10px 24px -10px rgba(13,13,13,.5);transition:transform .5s var(--ease)}
.hr-sound:hover{transform:translateX(-50%) scale(1.06)}
.hr-sound svg{width:16px;height:16px}
.hr-sound.is-blocked::before,.hr-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:hr-ping 2.2s var(--ease) infinite}
.hr-sound.is-blocked::after{animation-delay:1.1s}
@keyframes hr-ping{from{transform:scale(1);opacity:.55}to{transform:scale(2.1);opacity:0}}
.hr-scroll{position:absolute;z-index:2;left:50%;bottom:14px;transform:translateX(-50%);font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute-2)}
/* dark theme plays the black-backdrop clip; screen is the dark counterpart of multiply, so black melts into the page */
[data-theme="dark"] .hr-stage{mix-blend-mode:screen;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%),linear-gradient(#000 80%,transparent 99%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%),linear-gradient(#000 80%,transparent 99%);mask-composite:intersect}
@media (max-width:899px){
  .hr{min-height:auto;padding-top:76px;display:flex;flex-direction:column}
  .hr-ghost{top:30svh;font-size:27vw}
  .hr-stage{position:relative;left:auto;bottom:auto;transform:none;height:62svh;margin-inline:auto;max-width:100%}
  .hr-sound{bottom:auto;top:calc(76px + 62svh - 64px)}
  .hr-left,.hr-right{position:relative;left:auto;right:auto;bottom:auto;max-width:none;padding-inline:var(--gutter)}
  .hr-left{margin-top:8px}
  .hr-right{align-items:flex-start;text-align:left;margin-top:22px;padding-bottom:56px}
  .hr-ctas{justify-content:flex-start}
  .hr-scroll{display:none}
}
}
`;

type Status = "idle" | "on" | "muted";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLVideoElement>(null);
  const darkRef = useRef<HTMLVideoElement>(null);
  /** the clip matching the current theme; the other one stays paused (and unloaded until needed) */
  const activeRef = useRef<HTMLVideoElement | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wantSound = useRef(true);
  const visible = useRef(true);
  const [status, setStatus] = useState<Status>("idle");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    const dark = darkRef.current;
    if (!section || !light || !dark) return;
    const pick = () => (document.documentElement.dataset.theme === "dark" ? dark : light);
    activeRef.current = pick();
    activeRef.current.preload = "auto";
    const av = () => activeRef.current!;

    const tryPlay = async () => {
      if (!visible.current) return;
      const v = av();
      if (wantSound.current) {
        v.muted = false;
        try {
          await v.play();
          setStatus("on");
          setBlocked(false);
          return;
        } catch {
          setBlocked(true);
        }
      }
      v.muted = true;
      setStatus("muted");
      v.play().catch(() => {});
    };

    const unlock = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      detach();
      if (!wantSound.current) return;
      const v = av();
      v.muted = false;
      setBlocked(false);
      setStatus("on");
      if (visible.current) v.play().catch(() => {});
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const detach = () => evs.forEach((n) => removeEventListener(n, unlock, true));
    evs.forEach((n) => addEventListener(n, unlock, { capture: true, passive: true }));

    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        const v = av();
        if (visible.current) {
          if (v.paused) v.play().catch(() => tryPlay());
        } else if (!v.paused) v.pause();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(section);
    tryPlay();

    // start fetching the other theme's clip as soon as the visitor reaches for the theme toggle
    const warm = () => {
      const other = av() === light ? dark : light;
      if (other.preload === "auto") return;
      other.preload = "auto";
      other.load();
    };
    const onIntent = (e: Event) => (e.target as Element | null)?.closest?.(".nv-theme") && warm();
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);

    // swap clips when the theme changes, keeping position, sound and play state
    const mo = new MutationObserver(() => {
      const prev = av();
      const next = pick();
      if (next === prev) return;
      const t = prev.currentTime;
      const wasPlaying = !prev.paused;
      next.muted = prev.muted;
      prev.pause();
      activeRef.current = next;
      const resume = () => {
        if (Number.isFinite(next.duration) && next.duration > 0) next.currentTime = t % next.duration;
        if (wasPlaying && visible.current) next.play().catch(() => tryPlay());
      };
      if (next.preload !== "auto") {
        next.preload = "auto";
        next.load();
      }
      if (next.readyState >= 1) resume();
      else next.addEventListener("loadedmetadata", resume, { once: true });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      detach();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
    };
  }, []);

  const toggleSound = () => {
    const v = activeRef.current;
    if (!v) return;
    if (status === "on") {
      wantSound.current = false;
      v.muted = true;
      setStatus("muted");
    } else {
      wantSound.current = true;
      v.muted = false;
      setBlocked(false);
      setStatus("on");
      v.play().catch(() => {});
    }
  };

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    scrollToTarget(hash);
  };

  const soundOn = status === "on";

  return (
    <section ref={sectionRef} id="top" className="hr" aria-labelledby="hero-title">
      <style href="hero" precedence="medium">
        {css}
      </style>
      <span className="hr-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </span>

      <div className="hr-stage">
        {(["light", "dark"] as const).map((theme) => (
          <video
            key={theme}
            ref={theme === "light" ? lightRef : darkRef}
            className={`hr-video only-${theme}`}
            muted
            loop
            playsInline
            preload="none"
            width={768}
            height={960}
            aria-describedby="hero-video-desc"
          >
            <source src={`/hero/intro-${theme}.webm`} type="video/webm" />
            <source src={`/hero/intro-${theme}.mp4`} type="video/mp4" />
          </video>
        ))}
        <p id="hero-video-desc" className="sr-only">
          Looping intro video: {PROFILE.name} standing in the centre of the frame, introducing himself to the camera.
        </p>
      </div>

      <button
        ref={btnRef}
        type="button"
        className={`hr-sound ${blocked ? "is-blocked" : ""}`}
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Mute intro video sound" : "Play intro video with sound"}
      >
        {soundOn ? (
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="3.4" height="12" rx="1" />
            <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4 2.6v10.8a.9.9 0 0 0 1.37.77l8.6-5.4a.9.9 0 0 0 0-1.54l-8.6-5.4A.9.9 0 0 0 4 2.6Z" />
          </svg>
        )}
      </button>

      <div className="hr-left">
        <p className="hr-eyebrow hr-in">
          <i aria-hidden="true" />
          {PROFILE.name}
          {PROFILE.location ? ` · ${PROFILE.location}` : ""}
        </p>
        <h1 id="hero-title" className="hr-h1">
          <span className="rv-mask is-in">
            <span>Software</span>
          </span>
          <span className="rv-mask is-in">
            <span>Developer &amp; AI</span>
          </span>
          <span className="rv-mask is-in">
            <span className="accent">Engineer.</span>
          </span>
        </h1>
      </div>

      <div className="hr-right">
        <p className="hr-note hr-in" style={{ ["--i" as string]: 3 }}>
          Building real-world products that combine platform software development with machine learning and agentic AI.
        </p>
        <div className="hr-ctas hr-in" style={{ ["--i" as string]: 4 }}>
          <a href="#work" className="btn btn-primary" onClick={(e) => go(e, "#work")}>
            Explore work
          </a>
          <a href="#contact" className="btn btn-secondary" onClick={(e) => go(e, "#contact")}>
            Let&rsquo;s talk
          </a>
          <a href={PROFILE.resume} download className="btn btn-secondary">
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <span className="hr-scroll" aria-hidden="true">
        Scroll
      </span>
    </section>
  );
}
