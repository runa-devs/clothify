import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";

import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const providers: Provider[] = [GitHub, Discord];

export const providerMap = providers
  .map((provider: Provider & { icon?: string }) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return {
        id: providerData.id,
        name: providerData.name,
        icon: `https://authjs.dev/img/providers/${providerData.id}.svg`,
      };
    } else {
      return {
        id: provider.id,
        name: provider.name,
        icon: `https://authjs.dev/img/providers/${provider.id}.svg`,
      };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const authConfig = {
  providers,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;
