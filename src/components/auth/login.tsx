"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import { useState } from "react";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Logged In");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };
  return (
    <Button
      variant="outline"
      size="lg"
      className="bg-white hover:bg-white/80 flex justify-center items-center gap-x-2"
      onClick={handleLogin}
      disabled={isLoading}
    >
      <Image src="/github.svg" height={28} width={28} alt="github_logo" />
      Login with Github
    </Button>
  );
}
