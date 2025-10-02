"use client";

import { useState } from "react";
import Image from "next/image";
import placeholderImage from "../public/placeholder.png";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
};

export default function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  width = 300, 
  height = 450,
  fill = false 
}: Props) {
  const [error, setError] = useState(false);
  const imageSource = (!src || src === "N/A" || error) ? placeholderImage : src;

  return (
    <div className={className}>
      <Image
        src={imageSource}
        alt={alt}
        className="object-cover"
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority
        onError={() => setError(true)}
        unoptimized={imageSource === placeholderImage}
      />
    </div>
  );
}
