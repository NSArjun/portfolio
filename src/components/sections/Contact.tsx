"use client";

import { PointerEvent as RPointerEvent, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { SECTION_TAGS } from "@/lib/data";

const css = `
@layer components {
.ct{padding-bottom:40px}
.ct-h{font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(48px,10vw,176px);margin-top:26px}
.ct-h .ln{display:block}
.ct-h .lt{display:inline-block;will-change:transform}
.ct-h .lt.hop{animation:ct-hop .7s var(--ease)}
.ct-h .sp{display:inline-block;width:.26em}
@keyframes ct-hop{0%{transform:translateY(0)}30%{transform:translateY(-.16em)}55%{transform:translateY(.03em)}75%{transform:translateY(-.04em)}100%{transform:translateY(0)}}
.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:clamp(48px,8vh,96px)}
.ct-mail{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ct-mail a{font-size:clamp(22px,3.4vw,48px);font-weight:600;letter-spacing:-.035em;line-height:1.1;background:linear-gradient(currentColor,currentColor) 0 100%/100% 2px no-repeat;padding-bottom:4px;transition:background-size .6s var(--ease);overflow-wrap:anywhere}
.ct-mail a:hover{background-size:0 2px;background-position:100% 100%}
.ct-copy{height:36px;padding-inline:14px;border-radius:999px;font-family:var(--font-mono);font-size:12px;box-shadow:inset 0 0 0 1px var(--line-2);transition:background-color .4s var(--ease),color .4s var(--ease)}
.ct-copy:hover,.ct-copy.is-done{background:var(--ink);color:var(--on-ink)}
.ct-rows{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:40px;border-top:1px solid var(--line)}
.ct-row{display:flex;flex-direction:column;gap:4px;padding:18px 18px 18px 0;border-bottom:1px solid var(--line)}
.ct-row span{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute-2)}
.ct-row a{font-size:16px;font-weight:500;align-self:flex-start;transition:opacity .3s}
.ct-row a:hover{opacity:.6}
.ct-badge{position:relative;width:150px;height:150px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:var(--on-ink);transition:transform .6s var(--ease)}
.ct-badge:hover{transform:scale(1.05)}
.ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:ct-spin 18s linear infinite}
.ct-badge text{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.32em;text-transform:uppercase;fill:var(--on-ink)}
.ct-badge b{font-size:28px;font-weight:400}
@keyframes ct-spin{to{transform:rotate(360deg)}}
.ft{margin-top:clamp(72px,12vh,140px);padding-top:22px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute-2)}
.ft a{color:var(--ink);font-weight:500}
@media (max-width:719px){.ct-grid{grid-template-columns:minmax(0,1fr)}.ct-badge{width:120px;height:120px;justify-self:start}}
}
`;

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {Array.from(word).map((ch, i) => (
            <span key={i} className="lt">
              {ch}
            </span>
          ))}
          {wi < arr.length - 1 && <span className="sp" />}
        </span>
      ))}
    </>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const hop = (e: RPointerEvent<HTMLHeadingElement>) => {
    const el = e.target as HTMLElement;
    if (!el.classList.contains("lt") || el.classList.contains("hop")) return;
    el.classList.add("hop");
    el.addEventListener("animationend", () => el.classList.remove("hop"), { once: true });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const rows = [
    PROFILE.phone && PROFILE.phoneHref && { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
    { label: "GitHub", value: `@${PROFILE.githubHandle}`, href: PROFILE.github, ext: true },
    { label: "LinkedIn", value: "in/arjunns3705", href: PROFILE.linkedin, ext: true },
    { label: "LeetCode", value: "u/Arjunns", href: PROFILE.leetcode, ext: true },
    { label: "Kaggle", value: "arjunns07", href: PROFILE.kaggle, ext: true },
  ].filter(Boolean) as { label: string; value: string; href: string; ext?: boolean }[];

  return (
    <section id="contact" className="sec ct" aria-labelledby="contact-title">
      <style href="contact" precedence="medium">
        {css}
      </style>
      <div className="wrap">
        <p className="tag rv">{SECTION_TAGS.contact} — Contact</p>
        <h2 id="contact-title" className="ct-h" aria-label="Let’s build something together." onPointerOver={hop}>
          <span className="rv-mask ln" aria-hidden="true">
            <span>
              <Letters text="Let’s build" />
            </span>
          </span>
          <span className="rv-mask ln" aria-hidden="true">
            <span>
              <Letters text="something" /> <span className="accent">
                <Letters text="together." />
              </span>
            </span>
          </span>
        </h2>

        <div className="ct-grid">
          <div>
            <div className="ct-mail rv">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button type="button" className={`ct-copy ${copied ? "is-done" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <div className="ct-rows rv" style={{ ["--i" as string]: 1 }}>
              {rows.map((r) => (
                <div key={r.label} className="ct-row">
                  <span>{r.label}</span>
                  <a href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {r.value}
                    {r.ext && <span aria-hidden="true"> ↗</span>}
                  </a>
                </div>
              ))}
              {PROFILE.location && (
                <div className="ct-row">
                  <span>Based in</span>
                  <p style={{ fontSize: 16, fontWeight: 500 }}>{PROFILE.location}</p>
                </div>
              )}
            </div>
          </div>
          <a href={`mailto:${PROFILE.email}`} className="ct-badge rv" aria-label={`Say hello: email ${PROFILE.email}`}>
            <svg viewBox="0 0 150 150" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" textLength="345" lengthAdjust="spacing">
                  say hello · say hello · say hello ·
                </textPath>
              </text>
            </svg>
            <b aria-hidden="true">↗</b>
          </a>
        </div>

        <footer className="ft">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#top");
            }}
          >
            Back to top ↑
          </a>
          <span>Built with Next.js</span>
        </footer>
      </div>
    </section>
  );
}
