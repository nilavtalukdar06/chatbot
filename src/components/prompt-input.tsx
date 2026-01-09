"use client";

import TextareaAutosize from "react-textarea-autosize";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ArrowUpIcon } from "lucide-react";
import { useContext } from "react";
import { PromptContext } from "./context/prompt-provider";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import type { ChatStatus } from "ai";

interface Props {
  sendMessage: (message: { text: string }) => void;
  status: ChatStatus;
}

export function PromptInput({ sendMessage, status }: Props) {
  const trpc = useTRPC();
  const value = useContext(PromptContext);

  const mutation = useMutation(
    trpc.message.create.mutationOptions({
      onSuccess: (data) => {
        sendMessage({ text: data.content });
        value?.setPrompt("");
      },
      onError: () => {
        toast.error("Failed to send prompt");
      },
    })
  );

  return (
    <div className="grid w-full">
      <InputGroup className="bg-white rounded-2xl shadow-md p-2 border border-neutral-300">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter your prompt"
          value={value?.prompt}
          onChange={(e) => value?.setPrompt(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="ml-auto"
            size="sm"
            variant="default"
            onClick={() => mutation.mutate({ prompt: value?.prompt! })}
            disabled={
              Boolean(!value?.prompt) ||
              status === "streaming" ||
              status === "submitted"
            }
          >
            {mutation.isPending ? <Spinner /> : <ArrowUpIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
