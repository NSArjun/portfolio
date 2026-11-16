import { CERTIFICATIONS } from "@/lib/data";
import { SectionHead } from "../ui/SectionHead";

const css = `
@layer components {
.ce{background:var(--card);box-shadow:inset 0 1px 0 var(--line),inset 0 -1px 0 var(--line)}
.ce-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,96px);align-items:start}
.ce-side{position:sticky;top:110px}
.ce-count{margin-top:24px;font-size:15px;color:var(--mute-2);max-width:320px}
.ce-count b{color:var(--ink);font-weight:600}
.ce-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.ce-list li{border-bottom:1px solid var(--line)}
.ce-a{position:relative;display:grid;grid-template-columns:56px minmax(0,1fr) 28px;align-items:center;gap:16px;padding:28px 18px;isolation:isolate;overflow:hidden;transition:color .5s var(--ease)}
.ce-a::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
.ce-a:hover,.ce-a:focus-visible{color:var(--on-ink)}
.ce-a:hover::before,.ce-a:focus-visible::before{transform:scaleX(1)}
.ce-a:focus-visible{outline-offset:-2px}
.ce-n{font-family:var(--font-mono);font-size:12px;color:var(--mute-2);transition:color .5s var(--ease)}
.ce-t{font-size:clamp(19px,1.9vw,28px);font-weight:600;letter-spacing:-.03em;line-height:1.15}
.ce-i{display:block;font-size:14px;color:var(--mute-2);margin-top:6px;font-weight:400;letter-spacing:0;transition:color .5s var(--ease)}
.ce-a:hover .ce-n,.ce-a:hover .ce-i,.ce-a:focus-visible .ce-n,.ce-a:focus-visible .ce-i{color:var(--on-ink-2)}
.ce-arr{font-size:22px;opacity:0;transform:translate(-14px,10px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.ce-a:hover .ce-arr,.ce-a:focus-visible .ce-arr{opacity:1;transform:none}
@media (hover:none){.ce-arr{opacity:1;transform:none}}
@media (max-width:899px){.ce-grid{grid-template-columns:minmax(0,1fr)}.ce-side{position:relative;top:auto}.ce-a{grid-template-columns:40px minmax(0,1fr) 22px;padding:22px 8px}}
}
`;

const ISSUERS = new Set(CERTIFICATIONS.map((c) => c.issuer));

export function Certifications() {
  return (
    <section id="certifications" className="sec ce" aria-labelledby="certifications-title">
      <style href="certs" precedence="medium">
        {css}
      </style>
      <div className="wrap ce-grid">
        <div className="ce-side">
          <SectionHead id="certifications" label="Certifications" title="Always" accent="learning." />
          <p className="ce-count rv">
            <b>{String(CERTIFICATIONS.length).padStart(2, "0")}</b> certifications from <b>{ISSUERS.size}</b> issuers,
            each verifiable on Coursera.
          </p>
        </div>
        <ol className="ce-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.href} className="rv" style={{ ["--i" as string]: i }}>
              <a className="ce-a" href={c.href} target="_blank" rel="noopener noreferrer">
                <span className="ce-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ce-t">
                  {c.title}
                  <span className="ce-i">{c.issuer}</span>
                </span>
                <span className="ce-arr" aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only">(opens certificate in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
