import { useState, useCallback, useEffect } from "react";
import Swatch from "./Swatch";
import ExportBar from "./ExportBar";
import { generatePalette, HARMONY_NAMES } from "./colorUtils";

const HARMONY_LABELS = {
  random: "Random",
  complementary: "Complementary",
  analogous: "Analogous",
  triadic: "Triadic",
  monochrome: "Monochrome",
};

function makeLockedArray(colors, lockedFlags) {
  return colors.map((c, i) => (lockedFlags[i] ? c : null));
}

export default function App() {
  const [harmony, setHarmony] = useState("random");
  const [colors, setColors] = useState(() => generatePalette("random", null, []));
  const [lockedFlags, setLockedFlags] = useState(Array(5).fill(false));

  const regenerate = useCallback(() => {
    const locked = makeLockedArray(colors, lockedFlags);
    const next = generatePalette(harmony, null, locked);
    setColors(next);
  }, [colors, lockedFlags, harmony]);

  const handleHarmonyChange = (newHarmony) => {
    setHarmony(newHarmony);
    const locked = makeLockedArray(colors, lockedFlags);
    const next = generatePalette(newHarmony, colors[2], locked);
    setColors(next);
  };

  const toggleLock = (index) => {
    setLockedFlags((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Spacebar regenerates — fast workflow for picking favorites
  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" && e.target.tagName !== "BUTTON") {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [regenerate]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-body">
      {/* Header */}
      <header className="px-6 md:px-10 pt-8 pb-6 flex flex-col gap-1">
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
          Palette Forge
        </h1>
        <p className="text-muted text-sm max-w-md">
          Generate, lock, and export 5-color palettes. Press space to reshuffle.
        </p>
      </header>

      {/* Controls */}
      <div className="px-6 md:px-10 pb-6 flex flex-wrap items-center gap-2">
        {HARMONY_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => handleHarmonyChange(name)}
            aria-pressed={harmony === name}
            className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full border transition-colors ${
              harmony === name
                ? "bg-amber border-amber text-canvas"
                : "border-line text-muted hover:text-ink hover:border-ink"
            }`}
          >
            {HARMONY_LABELS[name]}
          </button>
        ))}
        <button
          onClick={regenerate}
          className="ml-auto px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-ink text-canvas hover:bg-amber transition-colors"
        >
          Generate ↻
        </button>
      </div>

      {/* Swatch row — the actual product */}
      <main className="flex-1 flex flex-col md:flex-row min-h-[55vh] border-y border-line">
        {colors.map((hex, i) => (
          <Swatch
            key={i}
            hex={hex}
            locked={lockedFlags[i]}
            onToggleLock={toggleLock}
            index={i}
          />
        ))}
      </main>

      {/* Export */}
      <div className="px-6 md:px-10 py-6 flex justify-center md:justify-start">
        <ExportBar colors={colors} />
      </div>

      {/* Footer — mandatory requirements live here */}
      <footer className="px-6 md:px-10 py-6 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-muted">
          <p className="text-ink font-medium">Mridula R</p>
          <a
            href="mailto:Blueberryhusk9@gmail.com"
            className="hover:text-amber transition-colors underline underline-offset-2"
          >
            Blueberryhusk9@gmail.com
          </a>
        </div>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full bg-amber text-canvas hover:opacity-90 transition-opacity w-fit"
        >
          Built for Digital Heroes
        </a>
      </footer>
    </div>
  );
}
