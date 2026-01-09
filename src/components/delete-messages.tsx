"use client";

import { TriangleAlertIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function DeleteMessages() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.message.deleteMany.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted Messages");
        queryClient.invalidateQueries({
          queryKey: trpc.message.getMany.queryKey(),
        });
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  return (
    <Dialog open={isOpen || mutation.isPending} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <TriangleAlertIcon className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light">
            This action cannot be undone. This will permanently delete your
            messages from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
