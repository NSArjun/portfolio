# AGENTS.md

- Install / run: `npm install`, `npm run dev`. Verify with `npm run build` (runs type-check + ESLint); `npm run lint` and `npx tsc --noEmit` also work standalone.
- All site text lives in `src/lib/data.ts` and must be traceable to `assets/source/documents/ArjunNS-Resume.pdf` (plus phone 9344103428, location Hyderabad and the Frontend skill line, supplied directly by Arjun). Never invent content.
- Section order (and nav/tag numbering in `NAV` / `SECTION_TAGS`): Hero → About → Experience → Skills → Work → Certifications → Achievements → Contact. The school entry was removed from the timeline at Arjun's request.
- Heimdall Builder's repo link is internal (gitlab.servicenow.net) and is intentionally not shown.
- Palette: white/black/gray only; brand logos keep official colours. No GSAP/three.js; Lenis is the only animation dependency.
- Light/dark theme: never hard-code `#fff`/`#0d0d0d`/hairline rgba in components; use the vars (`--ink`, `--paper`, `--card`, `--on-ink`, `--on-ink-2`, `--line-2`, `--glass`, `--ghost`). Test both themes (`colorScheme: "dark"` in Playwright).
- Component CSS goes in a `<style href precedence>` tag inside each component, wrapped in `@layer components`.
- Folders: raw inputs in `assets/source/{documents,images,video}/`; served files in `public/{files,hero,images,logos}/`; code in `src/components/{layout,sections,ui}/` and `src/lib/`. Import with the `@/` alias. Root holds only config + docs (tooling requires it).
- Hero assets: `python3 scripts/build-hero-assets.py` (light clip + stills) and `--variant dark` (dark clip) → `public/hero/intro-{light,dark}.{mp4,webm}` (needs ffmpeg, numpy, Pillow). Light clip uses multiply, dark clip uses screen; the Hero keeps one `<video>` per theme and swaps on `data-theme` changes.
- Keep first-load JS ≈130 kB (currently 132 kB; Next baseline is 103 kB). Static markup should stay in server components (e.g. `MiniUI` is passed into the client `Work` as props).
