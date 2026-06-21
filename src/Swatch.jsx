import { useState } from "react";
import { getReadableTextColor, hexToRgbString } from "./colorUtils";

export default function Swatch({ hex, locked, onToggleLock, index }) {
  const [copied, setCopied] = useState(false);
  const textColor = getReadableTextColor(hex);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // clipboard blocked — fail silently, hex is still visible
    }
  };

  return (
    <div
      className="group relative flex-1 min-h-[160px] md:min-h-0 flex flex-col justify-between transition-all duration-300"
      style={{ backgroundColor: hex }}
    >
      {/* Lock toggle */}
      <button
        onClick={() => onToggleLock(index)}
        aria-label={locked ? `Unlock color ${hex}` : `Lock color ${hex}`}
        aria-pressed={locked}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-opacity opacity-60 hover:opacity-100 focus-visible:opacity-100"
        style={{ color: textColor, border: `1.5px solid ${textColor}` }}
      >
        {locked ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="5" y="11" width="14" height="9" rx="1.5" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="5" y="11" width="14" height="9" rx="1.5" />
            <path d="M8 11V7a4 4 0 0 1 7.4-2" />
          </svg>
        )}
      </button>

      {/* Click target — flips to show big hex / copy */}
      <button
        onClick={handleCopy}
        className="flex-1 w-full flex flex-col items-center justify-center gap-2 px-4 cursor-pointer"
        style={{ color: textColor }}
        aria-label={`Copy hex code ${hex}`}
      >
        <span
          className={`font-mono font-semibold tracking-tight transition-all duration-200 ${
            copied ? "text-3xl md:text-4xl" : "text-lg md:text-xl"
          }`}
        >
          {copied ? "Copied" : hex}
        </span>
        {copied && (
          <span className="font-mono text-xs opacity-70">{hex}</span>
        )}
        {!copied && (
          <span className="font-body text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity">
            {hexToRgbString(hex)}
          </span>
        )}
      </button>
    </div>
  );
}
