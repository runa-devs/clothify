import { Protected } from "@/components/layout/protected";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { env } from "@/env";
import { ReactNode } from "react";

// In demo mode nothing here reads the request, so Next would prerender the page and fail on useSearchParams
export const dynamic = "force-dynamic";

export default function TryOnLayout({ children }: { children: ReactNode }) {
  if (env.DEMO) {
    return (
      <>
        <div className="container mx-auto max-w-5xl px-4 pt-6">
          <Alert>
            <AlertTitle>デモ版です</AlertTitle>
            <AlertDescription>
              アップロードした画像は保存されず、AI
              による生成も行いません。処理画面のあとにサンプルの結果を表示します。
            </AlertDescription>
          </Alert>
        </div>
        {children}
      </>
    );
  }

  return (
    <>
      <Protected>{children}</Protected>
    </>
  );
}
