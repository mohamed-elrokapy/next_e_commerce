"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../lib/utils";

/**
 * Fixed-ratio image with a graceful fallback: if the remote image fails to
 * load, a tinted tile with the item title is shown instead of a broken icon.
 */
export default function ItemImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  ratio = "aspect-[4/3]",
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary",
        ratio,
        className
      )}>
      {failed || !src ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center p-4 text-center font-display text-lg text-muted-foreground">
          {alt}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}
