export type Theme = "light" | "dark";

export const THEME_COLORS: Record<Theme, string> = { light: "#f4f2ee", dark: "#0f0f0e" };

/** Inlined in <head> so the stored (or system) theme is applied before first paint — no flash. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;
