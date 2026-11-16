import type { CSSProperties, ReactNode } from "react";

/** Official brand logos in /public/logos (devicon "original" / simple-icons), with brand tint for glows. */
export const BRAND: Record<string, { file: string; tint: string; dark?: "invert" | "lift" }> = {
  python: { file: "python", tint: "#3776AB" },
  c: { file: "c", tint: "#A8B9CC" },
  cplusplus: { file: "cplusplus", tint: "#00599C" },
  bash: { file: "bash", tint: "#4EAA25" },
  react: { file: "react", tint: "#61DAFB" },
  nextjs: { file: "nextjs", tint: "#000000", dark: "invert" },
  javascript: { file: "javascript", tint: "#F7DF1E" },
  typescript: { file: "typescript", tint: "#3178C6" },
  html5: { file: "html5", tint: "#E34F26" },
  css3: { file: "css3", tint: "#1572B6" },
  tailwindcss: { file: "tailwindcss", tint: "#06B6D4" },
  tensorflow: { file: "tensorflow", tint: "#FF6F00" },
  keras: { file: "keras", tint: "#D00000" },
  pytorch: { file: "pytorch", tint: "#EE4C2C" },
  scikitlearn: { file: "scikitlearn", tint: "#F7931E" },
  huggingface: { file: "huggingface", tint: "#FFD21E" },
  opencv: { file: "opencv", tint: "#5C3EE8" },
  modelcontextprotocol: { file: "modelcontextprotocol", tint: "#000000", dark: "invert" },
  docker: { file: "docker", tint: "#2496ED" },
  kubernetes: { file: "kubernetes", tint: "#326CE5" },
  helm: { file: "helm", tint: "#0F1689", dark: "lift" },
  apacheairflow: { file: "apacheairflow", tint: "#017CEE" },
  kubeflow: { file: "kubeflow", tint: "#4279F4" },
  prefect: { file: "prefect", tint: "#070E10", dark: "invert" },
  jenkins: { file: "jenkins", tint: "#D24939" },
  githubactions: { file: "githubactions", tint: "#2088FF" },
  gitlab: { file: "gitlab", tint: "#FC6D26" },
  prometheus: { file: "prometheus", tint: "#E6522C" },
  grafana: { file: "grafana", tint: "#F46800" },
  pandas: { file: "pandas", tint: "#150458", dark: "lift" },
  numpy: { file: "numpy", tint: "#4DABCF" },
  apachespark: { file: "apachespark", tint: "#E25A1C" },
  apachekafka: { file: "apachekafka", tint: "#231F20", dark: "invert" },
  postgresql: { file: "postgresql", tint: "#4169E1" },
  mongodb: { file: "mongodb", tint: "#47A248" },
  redis: { file: "redis", tint: "#FF4438" },
  elasticsearch: { file: "elasticsearch", tint: "#00BFB3" },
  snowflake: { file: "snowflake", tint: "#29B5E8" },
  googlebigquery: { file: "googlebigquery", tint: "#669DF6" },
  hadoop: { file: "hadoop", tint: "#66CCFF" },
  git: { file: "git", tint: "#F05032" },
  github: { file: "github", tint: "#181717", dark: "invert" },
  vscode: { file: "vscode", tint: "#007ACC" },
  googlecolab: { file: "googlecolab", tint: "#F9AB00" },
  figma: { file: "figma", tint: "#F24E1E" },
  fusion: { file: "fusion", tint: "#F37321" },
  blender: { file: "blender", tint: "#E87D0D" },
  leetcode: { file: "leetcode", tint: "#FFA116" },
  kaggle: { file: "kaggle", tint: "#20BEFF" },
  coursera: { file: "coursera", tint: "#0056D2" },
};

const p = (d: string) => <path d={d} />;

/** Thin line icons for concepts that have no brand logo. 24×24 grid, 1.4 stroke. */
export const CONCEPT: Record<string, ReactNode> = {
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      {p("M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13")}
      {p("M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5")}
    </>
  ),
  agent: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      {p("M12 8V4.5M9.5 4.5h5")}
      <circle cx="9.5" cy="13" r="1" />
      <circle cx="14.5" cy="13" r="1" />
      {p("M10 16.2h4M3 12.5v2.5M21 12.5v2.5")}
    </>
  ),
  framework: (
    <>
      {p("M12 3 3 7.5l9 4.5 9-4.5L12 3Z")}
      {p("m3 12 9 4.5 9-4.5")}
      {p("m3 16.5 9 4.5 9-4.5")}
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.5" />
      <rect x="15" y="4" width="6" height="5" rx="1.5" />
      <rect x="9" y="15" width="6" height="5" rx="1.5" />
      {p("M9 6.5h6M6 9v3.5a2 2 0 0 0 2 2h1M18 9v3.5a2 2 0 0 1-2 2h-1")}
    </>
  ),
  etl: (
    <>
      <ellipse cx="5.5" cy="6" rx="3" ry="1.4" />
      {p("M2.5 6v5c0 .8 1.3 1.4 3 1.4s3-.6 3-1.4V6")}
      {p("M10 9h5m0 0-2-2m2 2-2 2")}
      <rect x="16.5" y="5" width="5" height="8" rx="1.2" />
      {p("M4 17h16M4 20.5h10")}
    </>
  ),
  features: (
    <>
      {p("M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1")}
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      {p("m7 10 3 2.5L7 15M12.5 15.5H17")}
    </>
  ),
  leadership: (
    <>
      {p("M5 21V4")}
      {p("M5 4.5c3-1.6 5.5 1.6 8.5 0S18 3 19 4v8c-1 1-2.5 1.4-5.5 0S8 11.4 5 13")}
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      {p("M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5M15.5 14.6c2.6-.3 4.7 1.3 5.3 4.4")}
    </>
  ),
  communication: (
    <>
      {p("M4 5.5h11a2 2 0 0 1 2 2V13a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z")}
      {p("M17 9h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2.5L16 18h-3")}
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      {p("M12 7.5V12l3 2")}
    </>
  ),
  puzzle: p(
    "M10 3.5a2 2 0 1 1 4 0V5h4a1 1 0 0 1 1 1v4h-1.5a2 2 0 1 0 0 4H19v4a1 1 0 0 1-1 1h-4v-1.5a2 2 0 1 0-4 0V19H6a1 1 0 0 1-1-1v-4h1.5a2 2 0 1 0 0-4H5V6a1 1 0 0 1 1-1h4V3.5Z",
  ),
  strategy: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
      {p("M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3")}
    </>
  ),
  trophy: (
    <>
      {p("M7 4h10v5a5 5 0 0 1-10 0V4Z")}
      {p("M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3.5M8 20.5h8M9.5 17.5h5")}
    </>
  ),
  paper: (
    <>
      {p("M6 2.5h8l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5Z")}
      {p("M14 2.5V7h4.5M8 11.5h8M8 15h8M8 18.5h5")}
    </>
  ),
  cap: (
    <>
      {p("m12 4 10 5-10 5L2 9l10-5Z")}
      {p("M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6")}
    </>
  ),
  folder: (
    <>
      {p("M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-12Z")}
      {p("M3 10.5h18")}
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      {p("M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7")}
    </>
  ),
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export function brandTint(key: string): string | undefined {
  return BRAND[key]?.tint;
}

type Props = { name: string; size?: number; className?: string; style?: CSSProperties; strokeWidth?: number };

/** Renders a brand logo (<img>) or a concept line icon (inline SVG). Decorative: label text lives beside it. */
export function TechLogo({ name, size = 24, className, style, strokeWidth = 1.4 }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${brand.file}.svg`}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={[className, brand.dark && `logo-${brand.dark}`].filter(Boolean).join(" ") || undefined}
        style={{ width: size, height: size, objectFit: "contain", ...style }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {CONCEPT[name] ?? CONCEPT.framework}
    </svg>
  );
}
