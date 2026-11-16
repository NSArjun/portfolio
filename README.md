# Arjun N S — Portfolio

A quiet, single-page portfolio for **Arjun N S, Software Developer & AI Engineer**. It is white, black and gray, with one continuous scroll and a looping intro video in the hero.

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 4, plus component CSS in a `<style>` tag inside each component (wrapped in `@layer components`)
- Lenis for smooth scrolling. No GSAP, no three.js/WebGL. All motion uses CSS, IntersectionObserver and small `requestAnimationFrame` loops.
- Self-hosted fonts via `next/font/local`: Inter Tight, Instrument Serif and JetBrains Mono
- No runtime external scripts, CDNs or image services. First-load JS ≈ 132 kB.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checks + lints)
npm run start      # serve the production build
```

## Deployment

Live at **https://arjunns.vercel.app**, served by the Vercel project `arjunns` (team "Arjun's projects"). It is connected to `github.com/NSArjun/portfolio`, so every push to `main` deploys to production, and other branches get preview URLs.

- `vercel.json` pins the Next.js framework preset and the `npm ci` / `npm run build` commands.
- `package.json` → `engines.node` (`>=20.9.0 <23`) makes Vercel build on Node 22.
- `.npmrc` pins the public npm registry, so `package-lock.json` never points at a private mirror. Vercel can't reach private mirrors, and `npm ci` hangs if the lockfile uses one.
- `.vercelignore` keeps `assets/source/` (raw videos) and tooling out of CLI uploads.
- The Open Graph URL base comes from `NEXT_PUBLIC_SITE_URL` if set, otherwise from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.

Manual deploy: `vercel deploy --prod` (the folder is linked through `.vercel/`, which is gitignored). The Devin skills `deploy-to-vercel` and `vercel-cli` are installed in `.devin/skills/` and pinned in `skills-lock.json`.

## Content

**All text lives in `src/lib/data.ts`** (`PROFILE`, `NAV`, `SKILL_GROUPS`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`, `ACHIEVEMENTS`, plus the About card data). Components only read from it. Every item comes from `assets/source/documents/ArjunNS-Resume.pdf`. The phone number, location and Frontend skill line were supplied directly by Arjun. Nothing is invented. Achievements show only figures stated in the résumé; leadership roles without a figure show a word instead of a number.

To update the downloadable résumé, replace `public/files/ArjunNS-Resume.pdf` (and the master copy in `assets/source/documents/`).

## Project structure

```
.
├── assets/source/                  original, unprocessed inputs (not served)
│   ├── documents/ArjunNS-Resume.pdf    résumé — source of truth for all text
│   ├── images/portrait.jpg             portrait photo (ID card)
│   ├── images/servicenow-logo.png      ServiceNow wordmark as supplied
│   └── video/intro-{light,dark}.mp4    raw intro videos (white / black backdrop)
├── public/                         served as-is at /
│   ├── files/ArjunNS-Resume.pdf        "Résumé ↓" download
│   ├── hero/intro-{light,dark}.{mp4,webm}   generated hero loops
│   ├── images/portrait-bust.webp, og.jpg    generated stills
│   └── logos/*.svg|png + licenses/      brand logos and their licences
├── scripts/build-hero-assets.py    assets/source → public/hero + public/images
├── src/
│   ├── app/                        layout.tsx (metadata, fonts, theme script), page.tsx, globals.css, icon.svg
│   ├── components/
│   │   ├── layout/                 App.tsx (page shell), Navigation.tsx
│   │   ├── sections/               Hero, About, Experience, Skills, Work, Certifications, Achievements, Contact
│   │   └── ui/                     shared pieces (SectionHead, TechLogo, MiniUI, ThemeToggle, ThemedImg, RevealObserver)
│   ├── fonts/                      self-hosted woff2 + licenses/OFL-*.txt
│   └── lib/                        data.ts (all content), hooks.ts, scroll.tsx (Lenis), theme.ts
└── config                          package.json, next.config.ts, tsconfig.json, eslint/postcss configs (must stay at the root)
```

## Sections

| #  | Section        | Component                          | Signature interaction |
|----|----------------|------------------------------------|-----------------------|
| —  | Navigation     | `components/layout/Navigation.tsx` | Frosted pill after scrolling, sliding active indicator (IO `-45% 0px -50% 0px`), 2 px progress bar, clip-path mobile overlay (Esc closes, scroll locked) |
| —  | Hero           | `components/sections/Hero.tsx`     | Multiply-blended looping intro video, ghost first name, ▶/❚❚ sound button; pauses below 35 % visibility |
| 01 | About          | `components/sections/About.tsx`    | Lanyard ID card: damped pendulum swing, idle sway, 3D flip (hover / tap / Enter / Space) |
| 02 | Experience     | `components/sections/Experience.tsx` | Scroll-drawn timeline spine; stops light up as it reaches them; ServiceNow logo on the internship |
| 03 | Skills         | `components/sections/Skills.tsx`   | Periodic table of 61 skills, family filters, diagonal wave reveal, sticky inspector with brand logo |
| 04 | Work           | `components/sections/Work.tsx`     | Expanding accordion gallery with grayscale "Illustrative UI" mock-ups (`ui/MiniUI.tsx`) |
| 05 | Certifications | `components/sections/Certifications.tsx` | Ink-flood rows (server component, CSS only) |
| 06 | Achievements   | `components/sections/Achievements.tsx` | Pinned horizontal gallery, count-up numbers (easeOutQuart, 1.4 s), centre card lifts |
| 07 | Contact        | `components/sections/Contact.tsx`  | Letter-hop heading, copy-email chip (`aria-live`), spinning "say hello" badge, footer |

Shared pieces: `ui/SectionHead.tsx` (mono index tag + heading with an italic accent word), `ui/RevealObserver.tsx` (`.rv` / `.rv-mask` → `.is-in`, once), `ui/TechLogo.tsx` (`BRAND` / `CONCEPT` maps, `isBrand()`), `lib/hooks.ts` (`useInView`, `useScrollProgress`, `prefersReducedMotion`) and `lib/scroll.tsx` (Lenis provider, `scrollToTarget`, `lockScroll`).

**Light / dark theme.** The round sun/moon button in the nav (`ui/ThemeToggle.tsx`) switches themes with a circular View Transition reveal and saves the choice in `localStorage`. With no saved choice, the site follows the system `prefers-color-scheme`. An inline script from `lib/theme.ts` sets `data-theme` on `<html>` before first paint, so there's no flash. Every colour is a CSS variable in `globals.css` (`[data-theme="dark"]` overrides). Each theme has its own hero clip: `intro-light.*` (white backdrop, `mix-blend-mode: multiply`) for light and `intro-dark.*` (black backdrop, `mix-blend-mode: screen`) for dark. In both, the backdrop melts into the page. Only the active theme's clip is fetched. The other one starts loading when the visitor hovers or focuses the theme button. A theme switch keeps the playback position and sound state. Black brand logos invert (`logo-invert`), very dark ones brighten (`logo-lift`), and the ServiceNow wordmark swaps to a white-text version (`ui/ThemedImg.tsx`).

`prefers-reduced-motion` turns off Lenis, decorative animation, the card swing and the count-ups. All content stays visible.

## Rebuilding the hero video

`scripts/build-hero-assets.py` turns the raw intro clip in `assets/source/video/` into the hero assets:

1. Detects the person (the union bounding box over 8 frames; the horizontal centre comes from the head and torso, so floor shadows don't skew it) and crops a 4:5 frame, head to toe, centred. Pass `--crop W:H:X:Y` to override.
2. Scales to 768 × 960 and whitens the backdrop with `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`.
3. Makes the loop seamless. The last 0.5 s of picture cross-fades into the first 0.5 s (`xfade`). The audio gets the same cross-fade, done sample-accurately with an equal-power curve in numpy, so lips stay in sync and there's no click. Nothing is stretched or retimed.
4. Exports `public/hero/intro-light.mp4` (H.264 yuv420p, CRF 24, `-preset slow`, AAC 96 kbps, `+faststart`) and `public/hero/intro-light.webm` (VP9 CRF 36, Opus 80 kbps).
5. Writes `public/images/portrait-bust.webp` (480 × 600 head-to-shirt crop, from `--photo` or the sharpest frame) and `public/images/og.jpg` (1200 × 630).

Requirements: `ffmpeg`/`ffprobe`, Python 3.9+, `numpy` and `Pillow`. Pillow handles the WebP and JPEG stills, because some ffmpeg builds ship without `libwebp` or `drawtext`.

```bash
brew install ffmpeg            # or your platform's package manager
pip3 install numpy pillow
python3 scripts/build-hero-assets.py   # uses assets/source/video/intro-light.mp4 + images/portrait.jpg
```

Optional flags: `--video PATH`, `--photo PATH`, `--crop W:H:X:Y`, `--seconds 10`, `--fade 0.5`, `--name`, `--role`, `--font /path/to/font.ttf` (used for the OG text).

**Dark-theme clip.** `--variant dark` runs the same crop, loop and audio steps on the black-backdrop video. It crushes the near-black set to pure black (`colorlevels=rimin=0.08…`) instead of whitening it, writes `public/hero/intro-dark.mp4` / `.webm`, and skips the stills. Keep `--seconds` and `--fade` the same for both variants so the two loops stay the same length (9.458 s), which keeps the playback position in step across a theme switch.

```bash
python3 scripts/build-hero-assets.py --variant dark   # uses assets/source/video/intro-dark.mp4
```

## Credits & licences

- **Brand logos** in `public/logos/` keep their official colours. They are used only to identify each technology or platform. All trademarks belong to their owners.
  - [devicon](https://github.com/devicons/devicon) "original" SVGs, MIT licence: `public/logos/licenses/LICENSE-devicon.txt`.
  - [Simple Icons](https://github.com/simple-icons/simple-icons) paths (Prefect, Snowflake, Google BigQuery, Model Context Protocol, Coursera), filled with their official brand hex. CC0 1.0: `public/logos/licenses/LICENSE-simple-icons.md`; see also `licenses/DISCLAIMER-simple-icons.md`.
  - `servicenow.png`: ServiceNow wordmark supplied by Arjun (`assets/source/images/servicenow-logo.png`), with its baked-in checkerboard removed and converted to real transparency. ServiceNow is a trademark of ServiceNow, Inc.
  - Concept icons (SQL, agents, workflows, ETL, soft skills and others) are original line drawings in `src/components/ui/TechLogo.tsx`.
- **Fonts** (SIL Open Font License 1.1; `src/fonts/licenses/OFL-*.txt`): Inter Tight (The Inter Project Authors), Instrument Serif (Instrument), JetBrains Mono (JetBrains). The woff2 files come from Fontsource.
- The **intro video and portrait** are © Arjun N S.
