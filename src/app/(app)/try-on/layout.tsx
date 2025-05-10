import { Protected } from "@/components/layout/protected";
import { ReactNode } from "react";

export default function TryOnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Protected>{children}</Protected>
    </>
  );
}
