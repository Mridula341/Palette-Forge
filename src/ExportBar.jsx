import { useState } from "react";

export default function ExportBar({ colors }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(colors.join(", "));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    } catch {
      // ignore
    }
  };

  const downloadJson = () => {
    const data = JSON.stringify({ palette: colors }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    triggerDownload(blob, "palette.json");
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    const swatchWidth = 240;
    const height = 240;
    canvas.width = swatchWidth * colors.length;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    colors.forEach((hex, i) => {
      ctx.fillStyle = hex;
      ctx.fillRect(i * swatchWidth, 0, swatchWidth, height);

      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      ctx.fillStyle = luminance > 0.55 ? "#121214" : "#F3F1ED";
      ctx.font = "600 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText(hex, i * swatchWidth + swatchWidth / 2, height - 24);
    });

    canvas.toBlob((blob) => triggerDownload(blob, "palette.png"));
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={copyAll}
        className="px-4 py-2 text-sm font-medium rounded-full border border-line text-ink hover:border-amber hover:text-amber transition-colors"
      >
        {copiedAll ? "Copied all hex codes" : "Copy all hex codes"}
      </button>
      <button
        onClick={downloadPng}
        className="px-4 py-2 text-sm font-medium rounded-full border border-line text-ink hover:border-amber hover:text-amber transition-colors"
      >
        Download PNG
      </button>
      <button
        onClick={downloadJson}
        className="px-4 py-2 text-sm font-medium rounded-full border border-line text-ink hover:border-amber hover:text-amber transition-colors"
      >
        Download JSON
      </button>
    </div>
  );
}
