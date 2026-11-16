"use client";

import { ReactNode, useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { SectionHead } from "../ui/SectionHead";
import { TechLogo } from "../ui/TechLogo";

const css = `
@layer components {
.wk-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:48px}
.wk-count{font-family:var(--font-mono);font-size:12px;color:var(--mute-2)}
.wk-row{display:flex;gap:10px;height:min(78svh,600px)}
.wk-p{position:relative;flex:1 1 0;min-width:0;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;container-type:inline-size;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk-p.is-open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft)}
.wk-tog{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;text-align:center;border-radius:26px;transition:opacity .4s var(--ease)}
.wk-p.is-open .wk-tog{inset:auto 0 0 auto;width:1px;height:1px;padding:0;overflow:hidden;opacity:0}
.wk-p.is-open .wk-tog:focus-visible{width:44px;height:44px;inset:18px 18px auto auto;opacity:1}
.wk-num{font-family:var(--font-mono);font-size:12px;color:var(--mute-2)}
.wk-vt{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:clamp(18px,1.6vw,24px);letter-spacing:-.03em;white-space:nowrap;max-height:70%;overflow:hidden;text-overflow:ellipsis}
.wk-plus{width:36px;height:36px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line-2);display:grid;place-items:center;font-size:18px;transition:transform .6s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
.wk-tog:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:var(--on-ink)}
.wk-body{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px;padding:clamp(22px,2.4vw,36px);opacity:0;visibility:hidden;transition:opacity .4s var(--ease),visibility 0s .4s}
.wk-p.is-open .wk-body{opacity:1;visibility:visible;transition:opacity .7s var(--ease) .3s,visibility 0s}
.wk-info{display:flex;flex-direction:column;min-width:0}
.wk-k{font-family:var(--font-mono);font-size:11.5px;color:var(--mute-2);display:flex;gap:10px;flex-wrap:wrap}
.wk-info h3{font-size:clamp(30px,3.2vw,48px);font-weight:700;letter-spacing:-.045em;line-height:1;margin-top:14px}
.wk-kick{font-family:var(--font-serif);font-style:italic;font-size:20px;color:var(--mute-2);margin-top:8px;line-height:1.15}
.wk-desc{font-size:15px;line-height:1.55;color:var(--ink-2);margin-top:16px}
.wk-feat{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}
.wk-feat li{font-size:13px;line-height:1.35;color:var(--ink-2);display:grid;grid-template-columns:12px 1fr;gap:6px}
.wk-feat li::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--ink);margin-top:6px}
.wk-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:18px}
.wk-cta{margin-top:16px;align-self:flex-start}
.wk-ui{min-width:0;clip-path:inset(0 0 0 100% round 20px);transition:clip-path 1s var(--ease) .1s}
.wk-p.is-open .wk-ui{clip-path:inset(0 0 0 0 round 20px);transition-delay:.45s}
@container (max-width:720px){.wk-body{grid-template-columns:minmax(0,1fr)}.wk-ui{display:none}}
@media (max-width:899px){
  .wk-row{flex-direction:column;height:auto;gap:8px}
  .wk-p{flex:none;transition:box-shadow .6s var(--ease)}
  .wk-tog{position:relative;inset:auto;width:100%;flex-direction:row;justify-content:flex-start;gap:14px;padding:18px 20px;text-align:left}
  .wk-p.is-open .wk-tog{position:relative;inset:auto;width:auto;height:auto;padding:18px 20px;opacity:1;overflow:visible}
  .wk-p.is-open .wk-tog:focus-visible{width:auto;height:auto;inset:auto}
  .wk-vt{writing-mode:horizontal-tb;transform:none;font-size:20px;max-height:none;flex:1}
  .wk-p.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:var(--on-ink)}
  .wk-body{position:relative;inset:auto;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:0fr;padding:0 20px;transition:grid-template-rows .7s var(--ease),opacity .5s var(--ease),padding .7s var(--ease)}
  .wk-p.is-open .wk-body{grid-template-rows:1fr;padding:0 20px 22px}
  .wk-info{overflow:hidden;min-height:0}
  .wk-info h3{display:none}
  .wk-k{margin-top:0}
}
}
`;

/** `previews` are the server-rendered illustrative mini-UIs, keyed by project id. */
export function Work({ previews }: { previews: Record<Project["id"], ReactNode> }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="sec wk" aria-labelledby="work-title">
      <style href="work" precedence="medium">
        {css}
      </style>
      <div className="wrap">
        <div className="wk-head">
          <SectionHead id="work" label="Selected work" title="Things I’ve" accent="built." />
          <p className="wk-count rv">{String(PROJECTS.length).padStart(2, "0")} projects · hover or tap a panel</p>
        </div>
        <div className="wk-row rv">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`wk-p ${isOpen ? "is-open" : ""}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                aria-labelledby={`wk-t-${p.id}`}
              >
                <button
                  type="button"
                  className="wk-tog"
                  aria-expanded={isOpen}
                  aria-controls={`wk-b-${p.id}`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="wk-num">{p.index}</span>
                  <span className="wk-vt" id={`wk-t-${p.id}`}>
                    {p.title}
                  </span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="wk-body" id={`wk-b-${p.id}`} inert={!isOpen}>
                  <div className="wk-info">
                    <p className="wk-k">
                      <span>{p.index}</span>
                      <span>·</span>
                      <span>{p.date}</span>
                    </p>
                    <h3>{p.title}</h3>
                    <p className="wk-kick">{p.kicker}</p>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-feat">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <div className="wk-tech" aria-label="Technologies">
                      {p.tech.map((t) => (
                        <span key={t.name} className="chip">
                          {t.logo && <TechLogo name={t.logo} size={14} />}
                          {t.name}
                        </span>
                      ))}
                    </div>
                    {p.github && (
                      <a
                        className="btn btn-primary wk-cta"
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${p.title} on GitHub (opens in a new tab)`}
                      >
                        View on GitHub <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <div className="wk-ui">{previews[p.id]}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
