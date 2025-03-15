import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-6 py-6">
          <Link
            href="/try-on"
            className="flex items-center py-2 text-sm font-medium hover:text-primary"
          >
            試着する
          </Link>
          <Link
            href="/favorites"
            className="flex items-center py-2 text-sm font-medium hover:text-primary"
          >
            お気に入り
          </Link>
          <Link
            href="/history"
            className="flex items-center py-2 text-sm font-medium hover:text-primary"
          >
            履歴
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
