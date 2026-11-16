import type { ThemedLogo } from "@/lib/data";

/** Renders the light and dark variants of a logo; CSS shows the one matching the active theme. */
export function ThemedImg({ logo, className = "" }: { logo: ThemedLogo; className?: string }) {
  const common = { alt: logo.alt, width: logo.width, height: logo.height, loading: "lazy", decoding: "async" } as const;
  if (!logo.srcDark) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={logo.src} className={className} {...common} />;
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={logo.src} className={`${className} only-light`} {...common} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={logo.srcDark} className={`${className} only-dark`} {...common} />
    </>
  );
}
