"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const UserMenu = () => {
  const { data: session, status } = useSession();

  const user = session?.user;

  if (status === "loading") {
    return <UserIcon className="size-5" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2">
            <Avatar className="select-none">
              <AvatarImage draggable={false} src={user?.image ?? ""} />
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-bold">{user?.name ?? "ログインしてください"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
            <LogOut className="mr-2 size-4" />
            ログアウト
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer" onClick={() => signIn()}>
            <LogIn className="mr-2 size-4" />
            ログイン
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
