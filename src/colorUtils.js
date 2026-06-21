// Color utilities — all math lives here, components stay dumb.

export function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function randomHsl() {
  return {
    h: Math.floor(Math.random() * 360),
    s: 55 + Math.random() * 35,
    l: 45 + Math.random() * 25,
  };
}

// Harmony recipes — each returns an array of 5 {h,s,l} offsets relative to a base hue.
const HARMONIES = {
  random: () => Array.from({ length: 5 }, () => randomHsl()),

  complementary: (base) => {
    const { h, s, l } = base;
    return [
      { h, s, l: Math.max(15, l - 25) },
      { h, s: s * 0.85, l: Math.min(85, l + 12) },
      { h, s, l },
      { h: h + 180, s, l },
      { h: h + 180, s: s * 0.85, l: Math.max(15, l - 15) },
    ];
  },

  analogous: (base) => {
    const { h, s, l } = base;
    return [-30, -15, 0, 15, 30].map((off, i) => ({
      h: h + off,
      s: Math.max(20, s - Math.abs(off) * 0.3),
      l: i === 2 ? l : l + (off > 0 ? 8 : -8),
    }));
  },

  triadic: (base) => {
    const { h, s, l } = base;
    return [
      { h, s, l },
      { h, s: s * 0.7, l: Math.min(88, l + 20) },
      { h: h + 120, s, l },
      { h: h + 240, s, l },
      { h: h + 240, s: s * 0.7, l: Math.max(12, l - 18) },
    ];
  },

  monochrome: (base) => {
    const { h, s } = base;
    return [12, 30, 50, 70, 88].map((l) => ({ h, s, l }));
  },
};

export const HARMONY_NAMES = Object.keys(HARMONIES);

export function generatePalette(harmony, baseHex, lockedColors) {
  const base = baseHex ? hexToHsl(baseHex) : randomHsl();
  const recipe = HARMONIES[harmony] || HARMONIES.random;
  const hsls = recipe(base);

  return hsls.map((hsl, i) => {
    if (lockedColors[i]) return lockedColors[i];
    return hslToHex(hsl.h, hsl.s, hsl.l);
  });
}

// Relative luminance for WCAG-style contrast → decide black/white label text
export function getReadableTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

  return luminance > 0.45 ? "#121214" : "#F3F1ED";
}

export function hexToRgbString(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
