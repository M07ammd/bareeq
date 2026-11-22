"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Fills its (relatively positioned) parent with a photo, tuned toward the palette.
 * If the photo fails to load, the dark holographic artwork underneath stays visible instead of a broken image.
 */
export function PhotoFill({ src, alt, sizes, priority = false, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <div className="holo-art absolute inset-0" aria-hidden />
      {!failed && (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className={`photo-tone object-cover ${className}`}
          />
          <div aria-hidden className="photo-tint absolute inset-0" />
        </>
      )}
    </>
  );
}
