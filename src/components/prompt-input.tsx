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

interface Props {
  sendMessage: (message: { text: string }) => void;
}

export function PromptInput({ sendMessage }: Props) {
  const value = useContext(PromptContext);
  return (
    <div className="grid w-full p-4">
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
            disabled={Boolean(!value?.prompt)}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
