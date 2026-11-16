"use client";

import { useCallback, useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { SectionHead } from "../ui/SectionHead";
import { ThemedImg } from "../ui/ThemedImg";

const css = `
@layer components {
.ex-grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:clamp(32px,5vw,96px)}
.ex-side{position:sticky;top:110px;align-self:start}
.ex-lede{margin-top:24px;font-size:15px;color:var(--mute-2);max-width:340px}
.ex-tl{position:relative;list-style:none;margin:0;padding:0 0 0 52px}
.ex-spine,.ex-fill{position:absolute;left:15px;top:8px;bottom:8px;width:2px;border-radius:2px}
.ex-spine{background:var(--soft)}
.ex-fill{background:var(--ink);transform-origin:50% 0;transform:scaleY(0)}
.ex-stop{position:relative;padding-bottom:clamp(40px,6vh,64px)}
.ex-dot{position:absolute;left:-52px;top:2px;width:32px;height:32px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1.5px var(--faint);display:grid;place-items:center;transition:background-color .6s var(--ease),box-shadow .6s var(--ease),transform .6s var(--ease)}
.ex-dot::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--faint);transition:background-color .6s var(--ease)}
.ex-stop.is-lit .ex-dot{background:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink),0 0 0 6px rgba(13,13,13,.06);transform:scale(1.05)}
.ex-stop.is-lit .ex-dot::after{background:var(--on-ink)}
.ex-card{border-radius:24px;background:rgba(255,255,255,0);box-shadow:inset 0 0 0 1px var(--line);padding:clamp(20px,2.4vw,32px);transform:translateX(12px);transition:background-color .8s var(--ease),transform .8s var(--ease),box-shadow .8s var(--ease)}
.ex-stop.is-lit .ex-card{background:var(--card);transform:none;box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft)}
.ex-card h3{transition:color .8s var(--ease);color:var(--ink-2)}
.ex-stop.is-lit .ex-card h3{color:var(--ink)}
.ex-meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-family:var(--font-mono);font-size:12px;color:var(--mute-2)}
.ex-kind{text-transform:uppercase;letter-spacing:.08em}
.ex-card h3{font-size:clamp(22px,2.2vw,32px);font-weight:700;letter-spacing:-.035em;line-height:1.1;margin-top:12px}
.ex-place{font-family:var(--font-serif);font-style:italic;font-size:21px;color:var(--mute-2);margin-top:6px;line-height:1.2}
.ex-logo{margin-top:16px;line-height:0}
.ex-logo img{height:clamp(24px,2.2vw,32px);width:auto;display:block}
.ex-card .ex-role{margin-top:14px}
.ex-detail{font-size:15px;color:var(--ink-2);margin-top:12px;line-height:1.55}
.ex-pts{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-direction:column;gap:10px}
.ex-pts li{font-size:14.5px;line-height:1.55;color:var(--ink-2);padding-left:18px;position:relative}
.ex-pts li::before{content:"";position:absolute;left:0;top:10px;width:8px;height:1.5px;background:var(--ink)}
.ex-next .ex-card{background:transparent;box-shadow:none;border:1.5px dashed var(--line-2);opacity:1;transform:none}
.ex-next h3{font-size:clamp(26px,2.8vw,40px)}
.ex-next .ex-dot{box-shadow:inset 0 0 0 1.5px var(--faint);border:0}
@media (max-width:899px){.ex-grid{grid-template-columns:minmax(0,1fr)}.ex-side{position:relative;top:auto}.ex-tl{padding-left:44px}.ex-dot{left:-44px;width:28px;height:28px}.ex-spine,.ex-fill{left:13px}}
}
`;

const STOPS = [...EDUCATION, ...EXPERIENCE].sort((a, b) => a.start - b.start);

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((_p: number, el: HTMLDivElement) => {
    const r = el.getBoundingClientRect();
    const line = innerHeight * 0.62;
    const fill = Math.min(1, Math.max(0, (line - r.top) / r.height));
    (el.querySelector(".ex-fill") as HTMLElement).style.transform = `scaleY(${fill})`;
    el.querySelectorAll<HTMLElement>(".ex-stop").forEach((s) => {
      s.classList.toggle("is-lit", s.getBoundingClientRect().top + 18 < line);
    });
  }, []);
  useScrollProgress(listRef, onProgress);

  return (
    <section id="experience" className="sec ex" aria-labelledby="experience-title">
      <style href="experience" precedence="medium">
        {css}
      </style>
      <div className="wrap ex-grid">
        <div className="ex-side">
          <SectionHead id="experience" label="Experience" title="The path so" accent="far." />
          <p className="ex-lede rv">Education and experience as one timeline, in chronological order.</p>
        </div>
        <div ref={listRef} className="ex-tl">
          <span className="ex-spine" aria-hidden="true" />
          <span className="ex-fill" aria-hidden="true" />
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {STOPS.map((s) => (
            <li key={s.title} className="ex-stop">
              <span className="ex-dot" aria-hidden="true" />
              <article className="ex-card">
                <p className="ex-meta">
                  <span>{s.period}</span>
                  <span className="ex-kind">{s.kind}</span>
                </p>
                {s.logo ? (
                  <>
                    <p className="ex-logo">
                      <ThemedImg logo={s.logo} />
                    </p>
                    <h3 className="ex-role">{s.title}</h3>
                  </>
                ) : (
                  <>
                    <h3>{s.title}</h3>
                    <p className="ex-place">{s.place}</p>
                  </>
                )}
                {s.detail && <p className="ex-detail">{s.detail}</p>}
                {s.points && (
                  <ul className="ex-pts">
                    {s.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
          <li className="ex-stop ex-next" style={{ paddingBottom: 0 }}>
            <span className="ex-dot" aria-hidden="true" />
            <div className="ex-card">
              <p className="ex-meta">
                <span>Next</span>
              </p>
              <h3>
                Your team<span className="accent">?</span>
              </h3>
              <p className="ex-detail">
                <a
                  className="btn btn-secondary"
                  href="#contact"
                  style={{ marginTop: 4 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget("#contact");
                  }}
                >
                  Let&rsquo;s talk <span aria-hidden="true">→</span>
                </a>
              </p>
            </div>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
