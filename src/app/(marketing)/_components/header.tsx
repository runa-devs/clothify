"use client";

import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScroll();

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-background/80 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" className="dark:invert" alt="Clothify" width={96} height={96} />
        </Link>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/try-on">無料で始める</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* mobile menu */}
      {isMenuOpen && (
        <div className="absolute w-full bg-background/95 shadow-md backdrop-blur-md md:hidden">
          <div className="container mx-auto p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                特徴
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                料金
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                よくある質問
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    ログイン
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    無料で始める
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
