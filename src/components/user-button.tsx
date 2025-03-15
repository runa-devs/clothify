import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { User } from "lucide-react";
import Link from "next/link";

export async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/api/auth/signin">
          <User className="mr-2 size-4" />
          ログイン
        </Link>
      </Button>
    );
  }

  return <UserMenu />;
}
