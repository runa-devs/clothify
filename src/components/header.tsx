import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Clothify Logo"
              width={64}
              height={64}
              className="dark:invert"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/try-on" className="font-medium transition-colors hover:text-primary">
            試着する
          </Link>
          <Link href="/favorites" className="font-medium transition-colors hover:text-primary">
            お気に入り
          </Link>
          <Link href="/history" className="font-medium transition-colors hover:text-primary">
            履歴
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
