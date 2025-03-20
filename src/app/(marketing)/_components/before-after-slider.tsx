"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  className,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current || !e.touches[0]) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const handleDragStart = () => {
    setIsDragging(true);

    // グローバルイベントハンドラを追加
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // グローバルイベントハンドラを削除
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
  };

  const handleLocalMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging || !containerRef.current) return;

    let clientX: number;

    if ("touches" in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-lg border border-border"
        onMouseMove={handleLocalMove}
        onMouseDown={() => handleDragStart()}
        onMouseUp={() => handleDragEnd()}
        onTouchStart={() => handleDragStart()}
        onTouchEnd={() => handleDragEnd()}
        onTouchMove={handleLocalMove}
      >
        {/* After Image (Full width) */}
        {afterImage ? (
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-chart-5/10 to-chart-3/10">
            <p className="text-sm text-muted-foreground">バーチャル試着後</p>
          </div>
        )}

        <div className="absolute right-0 top-0 z-10 rounded-bl-md bg-chart-5/90 px-3 py-1 text-sm font-medium text-white">
          After
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {beforeImage ? (
            <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-cover"
              draggable={false}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-chart-2/10 to-chart-4/10">
              <p className="text-sm text-muted-foreground">自撮り写真</p>
            </div>
          )}

          <div className="absolute left-0 top-0 z-20 rounded-br-md bg-chart-2/90 px-3 py-1 text-sm font-medium text-white">
            Before
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute inset-y-0 z-30 w-1 cursor-ew-resize bg-white"
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleDragStart();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleDragStart();
          }}
        >
          <div className="absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <div className="flex flex-col gap-[3px]">
              <div className="h-[6px] w-[2px] rounded-full bg-gray-400"></div>
              <div className="h-[6px] w-[2px] rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
