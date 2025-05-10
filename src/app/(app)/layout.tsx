import { Header } from "@/app/(app)/_components/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
    </>
  );
}
