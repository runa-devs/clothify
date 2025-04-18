"use client";

import { Button } from "@/components/ui/button";
import type { ProviderMap } from "@/lib/auth/config";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

interface SignInButtonProps {
  provider: ProviderMap;
  signInAction: (providerId: string) => Promise<void>;
}

export function SocialSignInButton({ provider, signInAction }: SignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signInAction(provider.id);
        });
      }}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : provider.icon ? (
        <Image
          className={`mr-2 ${provider.id === "github" ? "dark:invert" : ""}`}
          src={provider.icon}
          alt=""
          width={20}
          height={20}
        />
      ) : null}
      {provider.name}でログイン
    </Button>
  );
}
