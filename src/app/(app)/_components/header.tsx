"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const isScrolled = useScroll();

  return (
    <header className={`fixed top-1 md:top-3 z-50 w-full transition-all duration-300`}>
      <div
        className={`container mx-auto flex h-16 max-w-4xl items-center justify-between px-8 ${
          isScrolled ? "bg-background/50 shadow-sm backdrop-blur-md rounded-full" : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" className="dark:invert" alt="Clothify" width={96} height={96} />
        </Link>

        <div className="flex items-center gap-4">
          {/* <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/notifications">
              <Bell className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/cart">
              <ShoppingCart className="size-5" />
            </Link>
          </Button> */}
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
