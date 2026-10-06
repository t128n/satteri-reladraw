import { THEMES, THEME_NAMES, type Theme } from "reladraw";

export type Accent = Theme["primary"];

/**
 * Mixes two hex colors together.
 * `amount` of `color` over `page`, default 0.25.
 */
export function mixColors(color: string, page: string, amount = 0.25): string {
  const normalize = (hex: string): string => {
    if (hex.startsWith("#") && hex.length === 4) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  };

  const c = normalize(color);
  const p = normalize(page);
  let out = "#";
  for (const at of [1, 3, 5]) {
    const pVal = parseInt(p.slice(at, at + 2), 16);
    const cVal = parseInt(c.slice(at, at + 2), 16);
    const value = Math.round(pVal + (cVal - pVal) * amount);
    out += Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
  }
  return out;
}

/**
 * Helper to construct an Accent object for a Theme.
 */
export function createAccent(
  color: string,
  page: string,
  on: string = "#ffffff",
  subtle?: string,
): Accent {
  return {
    color,
    subtle: subtle ?? mixColors(color, page, 0.25),
    on,
  };
}

/**
 * Simplified definition of a theme with sensible fallbacks for optional fields.
 */
export interface ThemeDefinition {
  background: string;
  boxFill: string;
  boxStroke: string;
  containerFill?: string;
  containerStroke?: string;
  text: string;
  mutedText?: string;
  edge: string;
  iconInk?: string;
  iconShade?: string;
  primary?: Accent;
  secondary?: Accent;
}

/**
 * Constructs a complete reladraw Theme object from a partial or full ThemeDefinition.
 */
export function defineTheme(def: ThemeDefinition): Theme {
  const containerFill = def.containerFill ?? mixColors(def.boxFill, def.background, 0.5);
  const containerStroke = def.containerStroke ?? mixColors(def.boxStroke, def.background, 0.5);
  const mutedText = def.mutedText ?? mixColors(def.text, def.background, 0.6);
  const iconInk = def.iconInk ?? mutedText;
  const iconShade = def.iconShade ?? def.boxFill;
  const primary = def.primary ?? createAccent(def.edge, def.background, def.text);
  const secondary = def.secondary ?? createAccent(def.edge, def.background, def.text);

  return {
    background: def.background,
    boxFill: def.boxFill,
    boxStroke: def.boxStroke,
    containerFill,
    containerStroke,
    text: def.text,
    mutedText,
    edge: def.edge,
    iconInk,
    iconShade,
    primary,
    secondary,
  };
}

/**
 * GitHub Light theme based on GitHub Primer colors.
 */
export const githubLight: Theme = {
  background: "#ffffff",
  boxFill: "#f6f8fa",
  boxStroke: "#d0d7de",
  containerFill: "#f6f8fa",
  containerStroke: "#d8dee4",
  text: "#1f2328",
  mutedText: "#656d76",
  edge: "#0969da",
  iconInk: "#57606a",
  iconShade: "#eaeef2",
  primary: createAccent("#0969da", "#ffffff", "#ffffff", "#ddf4ff"),
  secondary: createAccent("#1a7f37", "#ffffff", "#ffffff", "#dafbe1"),
};

/**
 * GitHub Dark theme based on GitHub Primer colors.
 */
export const githubDark: Theme = {
  background: "#0d1117",
  boxFill: "#161b22",
  boxStroke: "#30363d",
  containerFill: "#161b22",
  containerStroke: "#21262d",
  text: "#e6edf3",
  mutedText: "#848d97",
  edge: "#58a6ff",
  iconInk: "#848d97",
  iconShade: "#21262d",
  primary: createAccent("#238636", "#0d1117", "#ffffff", "#12261e"),
  secondary: createAccent("#f85149", "#0d1117", "#ffffff", "#2c1619"),
};

/**
 * Oxocarbon Dark theme based on nyoom-engineering/base16-oxocarbon.
 * IBM Carbon-inspired dark aesthetic.
 */
export const oxocarbonDark: Theme = {
  background: "#161616",
  boxFill: "#262626",
  boxStroke: "#393939",
  containerFill: "#1e1e1e",
  containerStroke: "#353535",
  text: "#f2f4f8",
  mutedText: "#a2a9b7",
  edge: "#78a9ff",
  iconInk: "#dde1e6",
  iconShade: "#393939",
  primary: createAccent("#08bdba", "#161616", "#ffffff", "#173738"),
  secondary: createAccent("#ee5396", "#161616", "#ffffff", "#3d1b28"),
};

/**
 * Oxocarbon Light theme based on nyoom-engineering/base16-oxocarbon.
 * IBM Carbon-inspired light aesthetic.
 */
export const oxocarbonLight: Theme = {
  background: "#f2f4f8",
  boxFill: "#ffffff",
  boxStroke: "#c1c7cd",
  containerFill: "#e5e9f0",
  containerStroke: "#dde1e6",
  text: "#161616",
  mutedText: "#525252",
  edge: "#0f62fe",
  iconInk: "#525252",
  iconShade: "#dde1e6",
  primary: createAccent("#0f62fe", "#f2f4f8", "#ffffff", "#d0e2ff"),
  secondary: createAccent("#ee5396", "#f2f4f8", "#ffffff", "#ffd6e8"),
};

/**
 * Additional default themes shipped with satteri-reladraw.
 */
export const DEFAULT_ADDITIONAL_THEMES: Readonly<Record<string, Theme>> = {
  "github-light": githubLight,
  "github-dark": githubDark,
  "oxocarbon-dark": oxocarbonDark,
  "oxocarbon-light": oxocarbonLight,
};

const mutableThemes = THEMES as Record<string, Theme>;
const mutableThemeNames = THEME_NAMES as string[];

// Auto-register default additional themes into reladraw's runtime dictionaries
for (const [name, theme] of Object.entries(DEFAULT_ADDITIONAL_THEMES)) {
  mutableThemes[name] = theme;
  if (!mutableThemeNames.includes(name)) {
    mutableThemeNames.push(name);
  }
}

/**
 * All built-in themes available out-of-the-box (reladraw core + satteri-reladraw additions).
 */
export const BUILTIN_THEMES: Readonly<Record<string, Theme>> = {
  ...THEMES,
  ...DEFAULT_ADDITIONAL_THEMES,
};

/**
 * List of all available built-in theme names.
 */
export const BUILTIN_THEME_NAMES: readonly string[] = Object.keys(BUILTIN_THEMES);

/**
 * A pair of themes used for auto light/dark switching.
 */
export interface ThemePair {
  dark: string | Theme | ThemeDefinition;
  light: string | Theme | ThemeDefinition;
}

/**
 * Preset theme pairs for automatic dark/light mode switching.
 */
export const THEME_PAIRS: Readonly<Record<string, ThemePair>> = {
  auto: { dark: "dark", light: "light" },
  default: { dark: "dark", light: "light" },
  github: { dark: "github-dark", light: "github-light" },
  oxocarbon: { dark: "oxocarbon-dark", light: "oxocarbon-light" },
  catppuccin: { dark: "catppuccin-mocha", light: "catppuccin-latte" },
  solarized: { dark: "solarized-dark", light: "solarized-light" },
  gruvbox: { dark: "gruvbox-dark", light: "gruvbox-light" },
  "high-contrast": { dark: "high-contrast-dark", light: "high-contrast-light" },
};

/**
 * Responsive CSS for auto-theming diagrams.
 * Supports Starlight (`[data-theme='dark']` / `[data-theme='light']`),
 * Tailwind (`.dark` / `.light`), and system `@media (prefers-color-scheme: dark)`.
 */
export const AUTO_THEME_CSS =
  '.reladraw-auto{display:block}.reladraw-auto .reladraw-dark{display:none}.reladraw-auto .reladraw-light{display:block}@media (prefers-color-scheme:dark){.reladraw-auto .reladraw-dark{display:block}.reladraw-auto .reladraw-light{display:none}}:root[data-theme="dark"] .reladraw-auto .reladraw-dark,html[data-theme="dark"] .reladraw-auto .reladraw-dark,.dark .reladraw-auto .reladraw-dark,[data-theme="dark"] .reladraw-auto .reladraw-dark{display:block!important}:root[data-theme="dark"] .reladraw-auto .reladraw-light,html[data-theme="dark"] .reladraw-auto .reladraw-light,.dark .reladraw-auto .reladraw-light,[data-theme="dark"] .reladraw-auto .reladraw-light{display:none!important}:root[data-theme="light"] .reladraw-auto .reladraw-dark,html[data-theme="light"] .reladraw-auto .reladraw-dark,.light .reladraw-auto .reladraw-dark,[data-theme="light"] .reladraw-auto .reladraw-dark{display:none!important}:root[data-theme="light"] .reladraw-auto .reladraw-light,html[data-theme="light"] .reladraw-auto .reladraw-light,.light .reladraw-auto .reladraw-light,[data-theme="light"] .reladraw-auto .reladraw-light{display:block!important}.reladraw svg{max-width:100%;height:auto}';

/**
 * Registers a custom theme into reladraw's runtime dictionaries so that
 * in-diagram `diagram theme: <name>` statements and code fence `theme="<name>"` resolve it.
 */
export function registerTheme(name: string, theme: Theme | ThemeDefinition): Theme {
  const resolved = defineTheme(theme);
  mutableThemes[name] = resolved;
  if (!mutableThemeNames.includes(name)) {
    mutableThemeNames.push(name);
  }
  return resolved;
}

/**
 * Registers multiple custom themes into reladraw's runtime dictionaries.
 */
export function registerThemes(themes: Record<string, Theme | ThemeDefinition>): void {
  for (const [name, theme] of Object.entries(themes)) {
    registerTheme(name, theme);
  }
}
