"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ABOUT_QUOTE, ID_CARD, PROFILE, QUICK_FACTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { SectionHead } from "../ui/SectionHead";
import { ThemedImg } from "../ui/ThemedImg";

const css = `
@layer components {
.ab-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,56px);align-items:stretch}
.ab .h2{font-size:clamp(44px,4.8vw,80px)}
.ab-left{display:flex;flex-direction:column;gap:22px}
.ab-sum{font-size:17px;line-height:1.6;color:var(--ink-2);margin-top:12px}
.ab-extra{font-size:15px;line-height:1.6;color:var(--mute-2);padding-left:16px;box-shadow:inset 1.5px 0 0 var(--ink)}
.ab-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:8px}
.ab-mid{position:relative;min-height:600px}
.ab-hang{position:absolute;left:50%;top:calc(-1 * var(--sec-pad));width:300px;margin-left:-150px;transform-origin:50% 0;transform:rotate(var(--a,0deg));will-change:transform;display:flex;flex-direction:column;align-items:center}
.ab-strap{width:30px;height:calc(var(--sec-pad) + 56px);background:#1a1a1a;position:relative;overflow:hidden;border-radius:0 0 4px 4px;box-shadow:inset 1px 0 0 rgba(255,255,255,.08),inset -1px 0 0 rgba(255,255,255,.08)}
[data-theme="dark"] .ab-strap{background:#2b2b29;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.ab-strap::before,.ab-strap::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.28) 0 3px,transparent 3px 7px)}
.ab-strap::before{left:4px}.ab-strap::after{right:4px}
.ab-strap-txt{position:absolute;left:50%;top:0;writing-mode:vertical-rl;transform:translateX(-50%);font-family:var(--font-mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:#d9d6d0;white-space:nowrap;animation:ab-strap 16s linear infinite}
@keyframes ab-strap{from{transform:translate(-50%,0)}to{transform:translate(-50%,-50%)}}
.ab-clip{position:relative;width:38px;height:34px;margin-top:-6px;z-index:2}
.ab-clip::before{content:"";position:absolute;left:8px;right:8px;top:0;height:16px;border-radius:4px;background:linear-gradient(180deg,#e8e8e8,#9a9a9a 55%,#cfcfcf);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.ab-clip::after{content:"";position:absolute;left:12px;right:12px;top:12px;height:22px;border-radius:0 0 8px 8px;border:2.5px solid #a3a3a3;border-top:0;background:transparent}
.ab-card-wrap{perspective:1400px;margin-top:-8px;width:300px;height:404px}
.ab-card{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease);cursor:pointer;border-radius:22px}
.ab-card.is-flipped{transform:rotateY(180deg)}
.ab-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:22px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -40px rgba(13,13,13,.45),0 18px 30px -22px rgba(13,13,13,.3);overflow:hidden;display:flex;flex-direction:column}
.ab-back{transform:rotateY(180deg)}
.ab-slot{position:absolute;top:12px;left:50%;width:46px;height:8px;margin-left:-23px;border-radius:8px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.25);z-index:2}
.ab-band{background:var(--ink);color:var(--on-ink);padding:30px 18px 12px;display:flex;justify-content:space-between;align-items:flex-end;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em}
.ab-band b{font-weight:600}
.ab-photo{position:relative;width:128px;height:156px;margin:18px auto 0;border-radius:16px;padding:3px;background:linear-gradient(150deg,#d6d3cd,#6f6d68 45%,#e7e4de 70%,#8d8a84)}
.ab-photo::before{content:"";position:absolute;inset:-14px;border-radius:28px;background:radial-gradient(closest-side,rgba(13,13,13,.10),transparent);z-index:-1}
.ab-photo-in{width:100%;height:100%;border-radius:13px;overflow:hidden;background:#fff}
.ab-photo img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.ab-card:hover .ab-photo img,.ab-card:focus-visible .ab-photo img{transform:scale(1.07)}
.ab-who{text-align:center;margin-top:12px}
.ab-who strong{display:block;font-size:20px;letter-spacing:-.03em;line-height:1.1}
.ab-who span{display:block;font-size:12px;color:var(--mute-2);margin-top:3px}
.ab-rows{margin:12px 18px 0;font-family:var(--font-mono);font-size:10.5px}
.ab-rows div{display:flex;justify-content:space-between;padding:5px 0;border-top:1px dashed var(--line-2)}
.ab-rows dt{color:var(--mute-2);text-transform:uppercase;letter-spacing:.08em}
.ab-rows dd{margin:0;color:var(--ink)}
.ab-foot{margin-top:auto;padding:0 18px 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.ab-bar{height:30px;flex:1}
.ab-holo{width:40px;height:40px;border-radius:50%;flex:none;background:conic-gradient(from var(--h,0deg),#f4f4f4,#bdbdbd,#fafafa,#8f8f8f,#e9e9e9,#b3b3b3,#f4f4f4);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);position:relative;overflow:hidden}
.ab-holo::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.9) 48%,transparent 62%);transform:translateX(-100%);animation:ab-shine 4.5s var(--ease) infinite}
@keyframes ab-shine{60%,100%{transform:translateX(100%)}}
.ab-back-in{padding:34px 22px 18px;display:flex;flex-direction:column;height:100%}
.ab-back h3{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute-2);font-weight:500}
.ab-back ol{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}
.ab-back li{display:grid;grid-template-columns:22px 1fr;font-size:13.5px;line-height:1.35;color:var(--ink-2)}
.ab-back li span{font-family:var(--font-mono);font-size:10px;color:var(--mute-2);padding-top:2px}
.ab-sign{margin-top:auto;font-family:var(--font-serif);font-style:italic;font-size:32px;line-height:1;border-bottom:1px solid var(--ink);padding-bottom:6px}
.ab-found{font-size:11px;color:var(--mute-2);margin-top:8px;font-family:var(--font-mono)}
.ab-hint{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-family:var(--font-mono);font-size:11px;color:var(--mute-2);white-space:nowrap}
.ab-right{display:flex;flex-direction:column;gap:28px;padding-top:clamp(0px,7vw,120px)}
.ab-facts h3{font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute-2);font-weight:500;margin-bottom:8px}
.ab-facts dl{margin:0}
.ab-facts div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
.ab-facts div:last-child{border-bottom:1px solid var(--line)}
.ab-facts dt{font-size:13px;color:var(--mute-2)}
.ab-facts dd{margin:0;font-size:15px;font-weight:500;overflow-wrap:anywhere}
.ab-fact-logo{display:block;height:20px;width:auto;margin:1px 0 8px}
.ab-facts a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.ab-facts a:hover{background-size:100% 1px}
.ab-quote{margin:auto 0 0;font-family:var(--font-serif);font-style:italic;font-size:clamp(26px,2.4vw,36px);line-height:1.12;letter-spacing:-.01em;color:var(--ink)}
.ab-quote::before{content:"“";display:block;font-size:64px;line-height:.6;color:var(--faint)}
.ab-quote figcaption{font-family:var(--font-sans);font-style:normal;font-size:13px;color:var(--mute-2);margin-top:12px}
@media (max-width:1079px){
  .ab-grid{grid-template-columns:minmax(0,1fr)}
  .ab-mid{order:-1;min-height:560px}
  .ab-right{padding-top:0}
}
}
`;

/** Deterministic barcode from a string, rendered as a grayscale repeating gradient. */
function barcode(seed: string) {
  let x = 0;
  const stops: string[] = [];
  for (let i = 0; i < 46; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = 1 + (c % 3);
    const color = i % 2 === 0 ? "var(--ink)" : "transparent";
    stops.push(`${color} ${x}px ${x + w}px`);
    x += w;
  }
  return { background: `linear-gradient(90deg, ${stops.join(",")})`, width: x };
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const hangRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const pointerType = useRef<string>("mouse");
  const bar = useMemo(() => barcode(PROFILE.name + ID_CARD.idNo + ID_CARD.validTill), []);

  useEffect(() => {
    const section = sectionRef.current;
    const hang = hangRef.current;
    if (!section || !hang || prefersReducedMotion()) return;
    let angle = 0;
    let vel = 0;
    let raf = 0;
    let lastX: number | null = null;
    let lastT = 0;
    const t0 = performance.now();

    const step = (now: number) => {
      const idle = Math.sin((now - t0) / 1500) * 1.4;
      vel += (-0.014 * (angle - idle) - 0.055 * vel);
      angle = Math.max(-12, Math.min(12, angle + vel));
      hang.style.setProperty("--a", `${angle.toFixed(3)}deg`);
      raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 100) {
        const v = (e.clientX - lastX) / Math.max(1, now - lastT);
        vel += Math.max(-0.9, Math.min(0.9, v * 0.18));
      }
      lastX = e.clientX;
      lastT = now;
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(step);
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <section ref={sectionRef} id="about" className="sec ab" aria-labelledby="about-title">
      <style href="about" precedence="medium">
        {css}
      </style>
      <div className="wrap ab-grid">
        <div className="ab-left">
          <SectionHead id="about" label="About" title="Hi, I’m" accent={`${PROFILE.firstName}.`} />
          <p className="ab-sum rv">{PROFILE.resumeSummary}</p>
          <p className="ab-extra rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.extraLine}
          </p>
          <div className="ab-btns rv" style={{ ["--i" as string]: 2 }}>
            <a className="btn btn-primary" href={PROFILE.resume} download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            <a className="btn btn-secondary" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="btn btn-secondary" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="ab-mid">
          <div ref={hangRef} className="ab-hang">
            <div className="ab-strap" aria-hidden="true">
              <span className="ab-strap-txt">
                {Array.from({ length: 8 }, () => `${PROFILE.name} · ${PROFILE.role} · `).join("")}
              </span>
            </div>
            <div className="ab-clip" aria-hidden="true" />
            <div className="ab-card-wrap">
              <div
                className={`ab-card ${flipped ? "is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flipped}
                aria-describedby="ab-card-hint"
                onPointerDown={(e) => (pointerType.current = e.pointerType)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
                onClick={() => pointerType.current !== "mouse" && setFlipped((f) => !f)}
                onKeyDown={onKey}
              >
                <div className="ab-face ab-front" aria-hidden={flipped}>
                  <span className="ab-slot" aria-hidden="true" />
                  <div className="ab-band">
                    <b>DEVELOPER ID</b>
                    <span>{PROFILE.initials}</span>
                  </div>
                  <div className="ab-photo">
                    <div className="ab-photo-in">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/portrait-bust.webp"
                        alt={`Portrait of ${PROFILE.name}`}
                        width={480}
                        height={600}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div className="ab-who">
                    <strong>{PROFILE.name}</strong>
                    <span>{PROFILE.role}</span>
                  </div>
                  <dl className="ab-rows">
                    <div>
                      <dt>ID No.</dt>
                      <dd>{ID_CARD.idNo}</dd>
                    </div>
                    <div>
                      <dt>Dept.</dt>
                      <dd>{ID_CARD.dept}</dd>
                    </div>
                    <div>
                      <dt>Valid till</dt>
                      <dd>{ID_CARD.validTill}</dd>
                    </div>
                  </dl>
                  <div className="ab-foot" aria-hidden="true">
                    <div className="ab-bar" style={{ background: bar.background, backgroundSize: `${bar.width}px 100%` }} />
                    <div className="ab-holo" />
                  </div>
                </div>
                <div className="ab-face ab-back" aria-hidden={!flipped}>
                  <span className="ab-slot" aria-hidden="true" />
                  <div className="ab-back-in">
                    <h3>What I am</h3>
                    <ol>
                      {ID_CARD.back.map((line, i) => (
                        <li key={line}>
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          {line}
                        </li>
                      ))}
                    </ol>
                    <p className="ab-sign" aria-label={`Signed, ${PROFILE.name}`}>
                      {PROFILE.name}
                    </p>
                    <p className="ab-found">
                      If found, say hello · {PROFILE.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="ab-hint" id="ab-card-hint">
            hover / tap to flip<span className="sr-only"> the developer ID card; press Enter or Space to flip</span>
          </p>
        </div>

        <div className="ab-right">
          <div className="ab-facts rv">
            <h3>Quick facts</h3>
            <dl>
              {QUICK_FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>
                    {f.logo && <ThemedImg logo={f.logo} className="ab-fact-logo" />}
                    {f.href ? <a href={f.href}>{f.value}</a> : f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="ab-quote rv" style={{ ["--i" as string]: 1 }}>
            <blockquote style={{ margin: 0 }}>{ABOUT_QUOTE}</blockquote>
            <figcaption>— {PROFILE.name}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
