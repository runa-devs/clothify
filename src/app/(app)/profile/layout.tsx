import { Protected } from "@/components/layout/protected";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Protected>{children}</Protected>
    </>
  );
}
