import { type Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/auth";
import { providerMap } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "新規登録",
  description: "新しいアカウントを作成してください",
};

interface SignUpPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { callbackUrl } = await searchParams;
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="container w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <div className="mb-1 flex items-center justify-center">
            <Image src="/logo.svg" alt="Logo" width={96} height={96} className="mr-2 dark:invert" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">ログイン</CardTitle>
          <CardDescription className="text-center">以下の情報を利用してログイン</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-4">
            {providerMap.map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server";
                  await signIn(provider.id, { redirectTo: callbackUrl ?? "" });
                }}
              >
                <Button variant="outline" className="w-full">
                  {provider.icon && (
                    <Image src={provider.icon} alt={provider.name} width={20} height={20} />
                  )}
                  {provider.name}でログイン
                </Button>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
