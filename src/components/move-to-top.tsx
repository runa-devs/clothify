"use client";

import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";

export const MoveToTop = () => {
  const isScrolled = useScroll();
  return (
    <div
      className={cn(
        "group fixed bottom-5 right-5 z-10 transition-opacity",
        isScrolled ? "opacity-100" : "opacity-0"
      )}
    >
      <Button
        size="icon"
        variant="secondary"
        className="shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="ページトップへスクロール"
      >
        <ChevronUp className="size-4" />
      </Button>
    </div>
  );
};
