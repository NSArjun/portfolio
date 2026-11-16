"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { SectionHead } from "../ui/SectionHead";
import { TechLogo, brandTint } from "../ui/TechLogo";

const css = `
@layer components {
.ac{position:relative}
.ac-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,56px)}
.ac-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.ac .h2{font-size:clamp(40px,5.6vw,88px)}
.ac-meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:var(--font-mono);font-size:12px;color:var(--mute-2)}
.ac-bar{width:180px;height:2px;background:var(--soft);border-radius:2px;overflow:hidden}
.ac-bar b{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.ac-track{display:flex;gap:clamp(14px,1.6vw,24px);width:max-content;padding:22px var(--gutter);list-style:none;margin:0;will-change:transform}
.ac-card{position:relative;flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:clamp(20px,2vw,28px);display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto 1fr;gap:12px;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ac-card.is-active{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 44px 70px -36px rgba(13,13,13,.35),0 16px 30px -20px rgba(13,13,13,.18)}
.ac-logo{position:relative;width:72px;height:72px;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;color:var(--ink)}
.ac-logo::before{content:"";position:absolute;inset:-22px;border-radius:50%;background:radial-gradient(closest-side,var(--tint),transparent);opacity:.14;z-index:-1;transition:opacity .8s var(--ease)}
.ac-card.is-active .ac-logo::before{opacity:.34}
.ac-idx{justify-self:end;font-family:var(--font-mono);font-size:12px;color:var(--mute-2)}
.ac-bl{align-self:end;min-width:0}
.ac-lbl{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute-2)}
.ac-cap{font-size:clamp(17px,1.4vw,20px);font-weight:600;letter-spacing:-.025em;line-height:1.2;margin-top:6px}
.ac-det{font-size:13px;line-height:1.45;color:var(--mute-2);margin-top:6px}
.ac-num{align-self:end;justify-self:end;font-weight:700;letter-spacing:-.06em;line-height:.85;font-size:clamp(64px,7vw,112px);font-variant-numeric:tabular-nums;white-space:nowrap}
.ac-num small{font-size:.32em;letter-spacing:-.02em;font-weight:600;color:var(--mute)}
.ac-num.txt{font-size:clamp(30px,3vw,48px);letter-spacing:-.045em;line-height:1}
.ac-card a.ac-link{position:absolute;inset:0;border-radius:28px;z-index:1}
.ac-end{flex:none;display:flex;align-items:center;padding-inline:clamp(20px,4vw,64px);font-family:var(--font-serif);font-style:italic;font-size:clamp(34px,4vw,60px);color:var(--mute);white-space:nowrap}
@media (max-width:899px){.ac-meta{align-items:flex-start}.ac-head{flex-direction:column;align-items:flex-start}.ac-card{width:min(340px,calc(100vw - 2 * var(--gutter)));grid-template-columns:minmax(0,1fr)}.ac-num{justify-self:start}.ac-bl{align-self:start}.ac-idx{position:absolute;right:20px;top:24px}}
}
`;

const total = String(ACHIEVEMENTS.length).padStart(2, "0");

function fmt(a: Achievement, v: number) {
  return v.toFixed(a.decimals ?? 0);
}

export function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".ac-card"));
    let travel = 0;
    let raf = 0;
    let active = -1;

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - innerWidth);
      section.style.height = `calc(100svh + ${travel}px)`;
      update();
    };
    const update = () => {
      raf = 0;
      const top = section.getBoundingClientRect().top;
      const p = travel > 0 ? Math.min(1, Math.max(0, -top / travel)) : 0;
      track.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const mid = innerWidth / 2;
      let best = -1;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      // cards skipped past by a fast scroll/jump show their final value
      cards.forEach((c, i) => {
        const n = c.querySelector<HTMLElement>("[data-value]");
        if (n && !n.dataset.done && c.getBoundingClientRect().right < 0) {
          n.dataset.done = "1";
          io.unobserve(n);
          n.textContent = fmt(ACHIEVEMENTS[i], ACHIEVEMENTS[i].value ?? 0);
        }
      });
      if (best !== active) {
        cards[active]?.classList.remove("is-active");
        cards[best]?.classList.add("is-active");
        active = best;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // count-up, once per card
    const reduce = prefersReducedMotion();
    const nums = cards
      .map((c) => c.querySelector<HTMLElement>("[data-value]"))
      .filter((n): n is HTMLElement => !!n);
    if (!reduce) nums.forEach((n) => (n.textContent = fmt(ACHIEVEMENTS[Number(n.dataset.i)], 0)));
    else nums.forEach((n) => (n.dataset.done = "1"));
    const io: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          if (el.dataset.done) continue;
          el.dataset.done = "1";
          const a = ACHIEVEMENTS[Number(el.dataset.i)];
          const target = a.value ?? 0;
          if (reduce) continue;
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = fmt(a, target * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );
    nums.forEach((n) => io.observe(n));

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    addEventListener("resize", measure);
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("resize", measure);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="ac" aria-labelledby="achievements-title">
      <style href="achievements" precedence="medium">
        {css}
      </style>
      <div className="ac-pin">
        <div className="wrap ac-head">
          <SectionHead id="achievements" label="Achievements" title="Proof of" accent="work." />
          <div className="ac-meta" aria-hidden="true">
            <span>Scroll to browse · {total} items</span>
            <span className="ac-bar">
              <b ref={barRef} />
            </span>
          </div>
        </div>
        <ol ref={trackRef} className="ac-track" aria-label="Achievements and leadership">
          {ACHIEVEMENTS.map((a, i) => (
            <li key={a.label + a.caption} className="ac-card" style={{ ["--tint" as string]: brandTint(a.logo) ?? "var(--ink)" }}>
              <span className="ac-logo" aria-hidden="true">
                <TechLogo name={a.logo} size={36} />
              </span>
              <span className="ac-idx">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>
              <div className="ac-bl">
                <p className="ac-lbl">{a.label}</p>
                <h3 className="ac-cap">{a.caption}</h3>
                <p className="ac-det">{a.detail}</p>
              </div>
              {a.value !== undefined ? (
                <p className="ac-num">
                  <span className="sr-only">
                    {a.prefix}
                    {fmt(a, a.value)}
                    {a.suffix}
                  </span>
                  <span aria-hidden="true">
                    {a.prefix && <small>{a.prefix}</small>}
                    <span data-value data-i={i}>
                      {fmt(a, a.value)}
                    </span>
                    {a.suffix && <small>{a.suffix}</small>}
                  </span>
                </p>
              ) : (
                <p className="ac-num txt">{a.bigText}</p>
              )}
              {a.href && (
                <a className="ac-link" href={a.href} target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Open {a.label} profile (new tab)</span>
                </a>
              )}
            </li>
          ))}
          <li className="ac-end" aria-hidden="true">
            and counting →
          </li>
        </ol>
      </div>
    </section>
  );
}
