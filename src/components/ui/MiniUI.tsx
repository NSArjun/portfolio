import type { Project } from "@/lib/data";

/** Grayscale, CSS-only mock interfaces that hint at what each project does. Not screenshots. */

const miniCss = `
@layer components {
.mu{position:relative;height:100%;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);padding:16px;display:flex;flex-direction:column;gap:10px;overflow:hidden;font-size:12px;color:var(--ink-2)}
.mu-tag{position:absolute;right:12px;top:12px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute-2);background:var(--card);padding:4px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);z-index:2}
.mu-win{flex:1;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 20px 40px -30px rgba(13,13,13,.4);overflow:hidden;display:flex;flex-direction:column;min-height:0}
.mu-bar{display:flex;align-items:center;gap:5px;padding:9px 12px;border-bottom:1px solid var(--line);font-family:var(--font-mono);font-size:10px;color:var(--mute-2)}
.mu-bar i{width:8px;height:8px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px var(--line-2)}
.mu-bar span{margin-left:8px}
.mu-in{padding:12px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0}
.mu-ln{height:7px;border-radius:4px;background:var(--soft)}
.mu-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);background:var(--card)}
.mu-ok{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--ink)}
.mu-dot{width:18px;height:18px;border-radius:6px;background:var(--ink);flex:none}
.mu-dot.lt{background:var(--soft);box-shadow:inset 0 0 0 1px var(--line-2)}
.mu-prog{height:6px;border-radius:6px;background:var(--soft);overflow:hidden}
.mu-prog b{display:block;height:100%;background:var(--ink);border-radius:6px;animation:mu-load 3.2s var(--ease) infinite}
@keyframes mu-load{0%{width:8%}70%,100%{width:100%}}
.mu-cols{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;flex:1;min-height:0}
.mu-tree{display:flex;flex-direction:column;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--mute-2);padding-right:10px;border-right:1px solid var(--line)}
.mu-red{display:inline-block;height:9px;border-radius:2px;background:var(--ink);vertical-align:middle}
.mu-pii{font-family:var(--font-mono);font-size:9px;padding:1px 5px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--line-2);margin-left:4px;vertical-align:middle}
.mu-seg{display:flex;gap:4px;padding:3px;border-radius:999px;background:var(--soft);align-self:flex-start}
.mu-seg span{padding:4px 10px;border-radius:999px;font-size:10.5px}
.mu-seg span.on{background:var(--ink);color:var(--on-ink)}
.mu-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mu-path{border-radius:12px;padding:10px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);display:flex;flex-direction:column;gap:8px;font-weight:600;font-size:11.5px}
.mu-bubble{align-self:flex-end;max-width:80%;padding:8px 12px;border-radius:14px 14px 4px 14px;background:var(--ink);color:var(--on-ink);font-size:11px}
.mu-bubble.in{align-self:flex-start;background:var(--soft);color:var(--ink-2);border-radius:14px 14px 14px 4px}
.mu-phone{align-self:center;width:min(100%,210px);flex:1;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 24px 40px -28px rgba(13,13,13,.45);padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}
.mu-notch{width:56px;height:6px;border-radius:6px;background:var(--soft);align-self:center;margin-bottom:4px}
.mu-scan{position:relative;height:84px;border-radius:12px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 5px,transparent 5px 9px,var(--ink) 9px 12px,transparent 12px 14px);background-size:100% 60%;background-position:center;background-repeat:no-repeat;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.mu-scan::after{content:"";position:absolute;left:0;right:0;height:2px;background:var(--ink);box-shadow:0 0 12px 2px rgba(13,13,13,.35);animation:mu-scan 2.4s ease-in-out infinite alternate}
@keyframes mu-scan{from{top:8%}to{top:90%}}
.mu-meter{display:grid;grid-template-columns:1fr 70px;align-items:center;gap:8px;font-size:10.5px}
.mu-feeds{display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1;min-height:0}
.mu-feed{position:relative;border-radius:10px;background:repeating-linear-gradient(0deg,var(--soft) 0 2px,var(--paper) 2px 4px);overflow:hidden;min-height:70px}
.mu-box{position:absolute;border:1.5px solid var(--ink);border-radius:4px;animation:mu-track 4s ease-in-out infinite alternate}
.mu-box em{position:absolute;left:-1.5px;top:-17px;font-style:normal;font-family:var(--font-mono);font-size:8.5px;background:var(--ink);color:var(--on-ink);padding:1px 4px;border-radius:3px;white-space:nowrap}
@keyframes mu-track{to{transform:translate(8px,4px)}}
.mu-rec{position:absolute;right:8px;top:8px;display:flex;align-items:center;gap:4px;font-family:var(--font-mono);font-size:8.5px;color:var(--ink)}
.mu-rec::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--ink);animation:mu-blink 1.2s steps(2) infinite}
@keyframes mu-blink{50%{opacity:0}}
.mu-av{width:24px;height:24px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px var(--line-2);flex:none}
.mu-k{font-family:var(--font-mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute-2)}
}
`;

const Lines = ({ w }: { w: number[] }) => (
  <>
    {w.map((x, i) => (
      <div key={i} className="mu-ln" style={{ width: `${x}%` }} />
    ))}
  </>
);

function Heimdall() {
  return (
    <div className="mu-win">
      <div className="mu-bar">
        <i />
        <i />
        <i />
        <span>heimdall · scan</span>
      </div>
      <div className="mu-in">
        <div className="mu-cols">
          <div className="mu-tree">
            <span>repo/</span>
            <span>&nbsp;├ src/</span>
            <span>&nbsp;├ config/</span>
            <span>&nbsp;└ tests/</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="mu-k">Scanning repository</span>
            <div className="mu-prog">
              <b />
            </div>
            <span className="mu-k" style={{ marginTop: 6 }}>
              Generated
            </span>
            {["Dockerfile", "Helm chart", "CI/CD pipeline"].map((f) => (
              <div key={f} className="mu-row">
                <span className="mu-dot lt" />
                {f}
                <span className="mu-ok">✓</span>
              </div>
            ))}
            <div className="mu-row" style={{ background: "var(--ink)", color: "var(--on-ink)" }}>
              CMDB workload deploy
              <span className="mu-ok" style={{ color: "var(--on-ink)" }}>
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RedactLess() {
  return (
    <div className="mu-win">
      <div className="mu-bar">
        <i />
        <i />
        <i />
        <span>document</span>
      </div>
      <div className="mu-in">
        <div className="mu-seg">
          <span className="on">Detect</span>
          <span>Mask</span>
          <span>Synthesize</span>
        </div>
        <Lines w={[92, 76]} />
        <div>
          <span className="mu-ln" style={{ display: "inline-block", width: "30%" }} />{" "}
          <span className="mu-red" style={{ width: "28%" }} />
          <span className="mu-pii">PII</span>
        </div>
        <Lines w={[84]} />
        <div>
          <span className="mu-red" style={{ width: "36%" }} />
          <span className="mu-pii">PII</span> <span className="mu-ln" style={{ display: "inline-block", width: "34%" }} />
        </div>
        <Lines w={[70, 88]} />
        <div>
          <span className="mu-ln" style={{ display: "inline-block", width: "18%" }} />{" "}
          <span className="mu-red" style={{ width: "22%" }} />
          <span className="mu-pii">PII</span>
        </div>
        <Lines w={[60]} />
      </div>
    </div>
  );
}

function Edith() {
  return (
    <div className="mu-win">
      <div className="mu-bar">
        <i />
        <i />
        <i />
        <span>learning paths</span>
      </div>
      <div className="mu-in">
        <div className="mu-g2">
          {["Arts", "Coding", "Financial Literacy", "Science"].map((p, i) => (
            <div key={p} className="mu-path">
              {p}
              <div className="mu-prog">
                <b style={{ animationDelay: `${i * 0.4}s` }} />
              </div>
            </div>
          ))}
        </div>
        <span className="mu-k" style={{ marginTop: 4 }}>
          Doubt resolution
        </span>
        <div className="mu-bubble">Ask a doubt…</div>
        <div className="mu-bubble in">
          <Lines w={[100]} />
        </div>
      </div>
    </div>
  );
}

function ConsumeWise() {
  return (
    <div className="mu-phone">
      <span className="mu-notch" />
      <span className="mu-k">Scan barcode</span>
      <div className="mu-scan" />
      {["Nutritional value", "Sustainability", "Ingredient suitability"].map((m, i) => (
        <div key={m} className="mu-meter">
          {m}
          <div className="mu-prog">
            <b style={{ animationDelay: `${i * 0.5}s` }} />
          </div>
        </div>
      ))}
      <div className="mu-row" style={{ marginTop: "auto" }}>
        <span className="mu-dot" />
        Health suggestion
      </div>
    </div>
  );
}

function SmartCam() {
  const feeds: { label: string; box: [number, number, number, number] }[] = [
    { label: "Face", box: [30, 22, 34, 46] },
    { label: "Vehicle", box: [14, 40, 56, 34] },
    { label: "Animal", box: [40, 44, 36, 30] },
    { label: "Anomaly", box: [22, 30, 30, 50] },
  ];
  return (
    <div className="mu-win">
      <div className="mu-bar">
        <i />
        <i />
        <i />
        <span>live feeds</span>
      </div>
      <div className="mu-in">
        <div className="mu-feeds">
          {feeds.map((f, i) => (
            <div key={f.label} className="mu-feed">
              <span className="mu-rec">CAM {i + 1}</span>
              <span
                className="mu-box"
                style={{
                  left: `${f.box[0]}%`,
                  top: `${f.box[1]}%`,
                  width: `${f.box[2]}%`,
                  height: `${f.box[3]}%`,
                  animationDelay: `${i * 0.7}s`,
                }}
              >
                <em>{f.label}</em>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hdims() {
  return (
    <div className="mu-phone">
      <span className="mu-notch" />
      <span className="mu-k">Patient records</span>
      {[70, 55, 80, 62].map((w, i) => (
        <div key={i} className="mu-row">
          <span className="mu-av" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            <div className="mu-ln" style={{ width: `${w}%` }} />
            <div className="mu-ln" style={{ width: `${w - 25}%`, height: 5 }} />
          </div>
        </div>
      ))}
      <div className="mu-row" style={{ marginTop: "auto", background: "var(--ink)", color: "var(--on-ink)" }}>
        Decision support
        <span className="mu-ok" style={{ color: "var(--on-ink)" }}>
          ●
        </span>
      </div>
    </div>
  );
}

const MAP: Record<Project["id"], () => React.JSX.Element> = {
  heimdall: Heimdall,
  redactless: RedactLess,
  edith: Edith,
  consumewise: ConsumeWise,
  smartcam: SmartCam,
  hdims: Hdims,
};

export function MiniUI({ id }: { id: Project["id"] }) {
  const C = MAP[id];
  return (
    <div className="mu" role="img" aria-label="Illustrative interface mock-up, not a real screenshot">
      <style href="mini-ui" precedence="medium">
        {miniCss}
      </style>
      <span className="mu-tag">Illustrative UI</span>
      <C />
    </div>
  );
}
