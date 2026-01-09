import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { authClient } from "@/utils/auth-client";

export function Menu() {
  const { data: session } = authClient.useSession();
  const openPortal = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to open customer portal");
    }
  };

  const checkout = async () => {
    try {
      await authClient.checkout({
        products: ["6659225f-fee6-4089-9d03-170b70757f77"],
        slug: "Chatbot-Pro-Plan",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to checkout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openPortal}>Billing</DropdownMenuItem>
        {session?.user.status === "free_user" && (
          <DropdownMenuItem onClick={checkout}>Upgrade</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
