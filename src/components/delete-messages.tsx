"use client";

import { TriangleAlertIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function DeleteMessages() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.message.deleteMany.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted Messages");
        queryClient.invalidateQueries({
          queryKey: trpc.message.getMany.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  return (
    <Button
      size="icon-sm"
      variant="outline"
      className="bg-white"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : (
        <TriangleAlertIcon className="text-muted-foreground" />
      )}
    </Button>
  );
}
