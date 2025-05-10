import { SignInButton } from "@/components/auth/signin-button";
import { auth } from "@/lib/auth";

type ProtectedProps = {
  children: React.ReactNode;
  exclude?: string[];
};

export const Protected: React.FC<ProtectedProps> = async ({ children }) => {
  const session = await auth();
  return session ? (
    <>{children}</>
  ) : (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">ログインが必要です</h2>
        <p className="text-sm text-muted-foreground">このページを見るにはログインが必要です。</p>
        <SignInButton className="mt-2">ログイン</SignInButton>
      </div>
    </div>
  );
};
