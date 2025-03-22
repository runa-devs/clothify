"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export const SignInButton = (props: ButtonProps) => {
  return <Button {...props} onClick={() => signIn()} />;
};
