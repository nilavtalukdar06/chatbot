"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/utils/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Logged Out");
          setIsLoading(false);
          router.push("/auth");
        },
      },
    });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoading}
      size="sm"
    >
      Logout
      <LogOutIcon />
    </Button>
  );
}
