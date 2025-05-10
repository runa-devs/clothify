"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const isScrolled = useScroll();

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" className="dark:invert" alt="Clothify" width={96} height={96} />
          <div className="rounded-full bg-blue-500 px-2 py-0.5 text-sm font-bold text-white">
            Beta
          </div>
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
