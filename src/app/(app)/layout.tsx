import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
