"use client";

import { useState, useMemo } from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

// Simple inline SVG placeholder (gray with film icon)
const FALLBACK_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <g fill="#9ca3af" transform="translate(150 225)">
        <circle r="60" fill="none" stroke="#9ca3af" stroke-width="6" />
        <path d="M-30 -20 h60 v40 h-60 z M10 -25 l35 -20 v90 l-35 -20 z M-10 -25 l-35 -20 v90 l35 -20 z" />
      </g>
    </svg>`
  );

export default function ImageWithFallback({ src, alt, className }: Props) {
  const initial = useMemo(() => {
    if (!src || src === "N/A") return FALLBACK_DATA_URL;
    return src;
  }, [src]);

  const [currentSrc, setCurrentSrc] = useState<string>(initial);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(FALLBACK_DATA_URL)}
    />
  );
}
