"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn } from "lucide-react";
import { cn } from "@/utils/helpers";

interface ImageCarouselProps {
  images: (string | undefined)[];
  alt?: string;
  /** Tailwind aspect class for the main frame, e.g. "aspect-square". */
  aspect?: string;
  /** Magnification factor on hover. */
  zoomScale?: number;
  className?: string;
}

// E-commerce style image gallery: a large main image with a thumbnail strip,
// prev/next controls, and hover-to-magnify (the image zooms toward the cursor).
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt = "",
  aspect = "aspect-square",
  zoomScale = 2.2,
  className,
}) => {
  const valid = images.filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  if (valid.length === 0) {
    return (
      <div
        className={cn(
          "w-full grid place-items-center rounded-xl border border-N30 bg-N10 text-N300",
          aspect,
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff size={28} />
          <span className="text-xs">No image</span>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(active, valid.length - 1);
  const current = valid[safeIndex];
  const go = (dir: number) =>
    setActive((a) => (a + dir + valid.length) % valid.length);

  const onMove = (e: React.MouseEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-N30 bg-N10 cursor-zoom-in",
          aspect,
        )}
      >
        <img
          src={current}
          alt={alt}
          draggable={false}
          style={{
            transformOrigin: origin,
            transform: zoom ? `scale(${zoomScale})` : "scale(1)",
          }}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
        />

        {!zoom && (
          <span className="absolute top-3 right-3 grid place-items-center rounded-full bg-white/90 p-1.5 text-N600 shadow">
            <ZoomIn size={14} />
          </span>
        )}

        {valid.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 text-N700 shadow hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 text-N700 shadow hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white">
              {safeIndex + 1} / {valid.length}
            </span>
          </>
        )}
      </div>

      {valid.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {valid.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                i === safeIndex
                  ? "border-BR400"
                  : "border-N30 hover:border-N40",
              )}
            >
              <img
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
