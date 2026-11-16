"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { SectionHead } from "../ui/SectionHead";
import { TechLogo, brandTint, isBrand } from "../ui/TechLogo";

const css = `
@layer components {
.sk-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.sk-lede{max-width:360px;font-size:15px;color:var(--mute-2)}
.sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
.sk-chip{height:36px;padding-inline:15px;border-radius:999px;font-size:13.5px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--line-2);transition:background-color .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease)}
.sk-chip:hover{box-shadow:inset 0 0 0 1px var(--ink)}
.sk-chip[aria-pressed="true"]{background:var(--ink);color:var(--on-ink);box-shadow:inset 0 0 0 1px var(--ink)}
.sk-chip small{font-family:var(--font-mono);font-size:10.5px;margin-left:6px;opacity:.6}
.sk-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,2.4vw,36px);margin-top:28px;align-items:start}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.sk-tile{position:relative;width:100%;aspect-ratio:1/1.08;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:9px 10px;display:flex;flex-direction:column;text-align:left;transition:opacity .5s var(--ease),transform .6s var(--ease),background-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease),filter .5s var(--ease)}
.sk-tile .n{font-family:var(--font-mono);font-size:10px;color:var(--mute-2)}
.sk-tile .s{font-size:clamp(20px,2.3vw,34px);font-weight:700;letter-spacing:-.05em;line-height:1;margin:auto 0 4px}
.sk-tile .nm{font-size:11px;font-weight:500;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sk-tile .f{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.sk-tile:hover,.sk-tile.is-active{background:var(--ink);color:var(--on-ink);box-shadow:0 18px 30px -18px rgba(13,13,13,.6);transform:translateY(-3px)}
.sk-tile:hover .n,.sk-tile:hover .f,.sk-tile.is-active .n,.sk-tile.is-active .f{color:var(--on-ink-2)}
.sk-tile.is-dim{opacity:.22;filter:grayscale(1)}
.sk-tile.is-dim:hover{opacity:.6}
@media (scripting:enabled){.sk-grid:not(.is-in) .sk-tile{opacity:0;transform:translateY(18px) scale(.94)}}
.sk-grid.is-in .sk-tile{transition-delay:var(--d8),var(--d8),0s,0s,0s,0s}
.sk-grid.is-done .sk-tile{transition-delay:0s}
.sk-insp{position:sticky;top:96px;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft);padding:22px;overflow:hidden}
.sk-insp-top{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--mute-2);text-transform:uppercase;letter-spacing:.06em}
.sk-logo{position:relative;height:210px;display:grid;place-items:center;margin:8px 0 4px}
.sk-glow{position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(closest-side,var(--tint),transparent);opacity:.16;filter:blur(6px)}
.sk-pop{position:relative;animation:sk-pop .7s var(--ease) both;color:var(--ink)}
@keyframes sk-pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}to{opacity:1;transform:none}}
.sk-insp h3{font-size:28px;font-weight:700;letter-spacing:-.04em;line-height:1.05}
.sk-fam{font-size:13px;color:var(--mute-2);margin-top:6px}
.sk-used{margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
.sk-used h4{font-family:var(--font-mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute-2);font-weight:500}
.sk-used ul{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-direction:column;gap:6px}
.sk-used li{font-size:14px;display:flex;gap:8px;align-items:baseline}
.sk-used li::before{content:"↳";color:var(--mute)}
.sk-used p{font-size:14px;color:var(--ink-2);margin-top:8px}
@media (max-width:1023px){.sk-body{grid-template-columns:minmax(0,1fr)}.sk-insp{position:relative;top:auto}}
@media (max-width:719px){
  .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
  .sk-grid.is-in .sk-tile{transition-delay:var(--d4),var(--d4),0s,0s,0s,0s}
  .sk-tile{padding:7px 8px;border-radius:12px}
  .sk-tile .s{font-size:24px}
  .sk-tile .f{display:none}
  .sk-logo{height:180px}
}
}
`;

type Flat = { n: number; name: string; symbol: string; logo: string; family: string; resumeLabel: string; usedIn?: string[] };

export function Skills() {
  const all = useMemo<Flat[]>(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) =>
      g.skills.map((s) => ({ ...s, n: ++n, family: g.family, resumeLabel: g.resumeLabel })),
    );
  }, []);
  const [filter, setFilter] = useState<string | null>(null);
  const [current, setCurrent] = useState<Flat>(all[0]);
  const [done, setDone] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { threshold: 0.15 });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, [inView]);

  const tint = brandTint(current.logo) ?? "var(--ink)";

  return (
    <section id="skills" className="sec sk" aria-labelledby="skills-title">
      <style href="skills" precedence="medium">
        {css}
      </style>
      <div className="wrap">
        <div className="sk-head">
          <SectionHead id="skills" label="Skills" title="The periodic table of my" accent="stack." />
          <p className="sk-lede rv">
            Every skill from the résumé as an element: {all.length} in total. Hover, focus or tap one to inspect it, or
            filter by family.
          </p>
        </div>

        <div className="sk-chips rv" role="group" aria-label="Filter skills by family">
          <button type="button" className="sk-chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
            All<small>{all.length}</small>
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.family}
              type="button"
              className="sk-chip"
              aria-pressed={filter === g.family}
              onClick={() => setFilter((f) => (f === g.family ? null : g.family))}
            >
              {g.family}
              <small>{g.skills.length}</small>
            </button>
          ))}
        </div>

        <div className="sk-body">
          <ul ref={gridRef} className={`sk-grid ${inView ? "is-in" : ""} ${done ? "is-done" : ""}`} aria-label="Skills">
            {all.map((s, i) => {
              const style = {
                "--d8": `${(Math.floor(i / 8) + (i % 8)) * 40}ms`,
                "--d4": `${(Math.floor(i / 4) + (i % 4)) * 40}ms`,
              } as CSSProperties;
              const dim = filter !== null && filter !== s.family;
              return (
                <li key={s.n} className="contents">
                  <button
                    type="button"
                    className={`sk-tile ${dim ? "is-dim" : ""} ${current.n === s.n ? "is-active" : ""}`}
                    style={style}
                    aria-label={`${s.name}, ${s.family}`}
                    aria-describedby="sk-insp"
                    onPointerEnter={() => setCurrent(s)}
                    onFocus={() => setCurrent(s)}
                    onClick={() => setCurrent(s)}
                  >
                    <span className="n" aria-hidden="true">
                      {s.n}
                    </span>
                    <span className="s" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span className="nm" aria-hidden="true">
                      {s.name}
                    </span>
                    <span className="f" aria-hidden="true">
                      {s.family}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside id="sk-insp" className="sk-insp" aria-live="polite" aria-label="Skill inspector">
            <div className="sk-insp-top">
              <span>No. {String(current.n).padStart(2, "0")}</span>
              <span>{current.symbol}</span>
            </div>
            <div className="sk-logo" style={{ ["--tint" as string]: tint }}>
              <span className="sk-glow" aria-hidden="true" />
              <span className="sk-pop" key={current.n}>
                <TechLogo name={current.logo} size={150} strokeWidth={isBrand(current.logo) ? undefined : 0.9} />
              </span>
            </div>
            <h3>{current.name}</h3>
            <p className="sk-fam">
              {current.family} · listed under “{current.resumeLabel}”
            </p>
            {current.usedIn?.length ? (
              <div className="sk-used">
                <h4>Used in</h4>
                <ul>
                  {current.usedIn.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
