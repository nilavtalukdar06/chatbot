"use client";

import { PromptInput } from "./prompt-input";
import { useChat } from "@ai-sdk/react";
import { dbMessageToUIMessage, ExtendedUIMessage } from "@/utils/ui-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Claude } from "@lobehub/icons";
import { format } from "date-fns";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageSquare } from "lucide-react";
import { Shimmer } from "./ai-elements/shimmer";
import { useEffect } from "react";

export function MessageContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.message.getMany.queryOptions());
  const { messages, sendMessage, status, setMessages } =
    useChat<ExtendedUIMessage>({
      id: "my-chat",
    });

  useEffect(() => {
    setMessages(data.map((message) => dbMessageToUIMessage(message)).reverse());
  }, [data, setMessages]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Conversation className="flex-1 flex flex-col min-h-0">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="Start a conversation"
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message, index) => (
              <Message from={message.role} key={index}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            className="space-y-4"
                            key={`${message.role}-${i}`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex flex-col items-start justify-center gap-y-2">
                                <div className="flex justify-start items-center gap-x-2">
                                  <Claude.Color size={18} />
                                  <Claude.Text size={14} />
                                </div>
                                <p className="text-muted-foreground text-xs font-light">
                                  {format(
                                    message?.metadata?.createdAt || new Date(),
                                    "MMM d, yyyy, h:mm a"
                                  )}
                                </p>
                              </div>
                            )}
                            <MessageResponse>{part.text}</MessageResponse>
                          </div>
                        );
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <div className="flex justify-start items-center gap-x-2">
                <Claude.Color size={18} />
                <Claude.Text size={14} />
              </div>
              <Shimmer duration={1} className="font-light text-sm">
                Loading...
              </Shimmer>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <div className="flex justify-start items-center gap-x-2">
                <Claude.Color size={18} />
                <Claude.Text size={14} />
              </div>
              <p className="text-sm text-red-500 font-light">
                Failed to fulfill your request, please try again later.
              </p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="relative px-4 py-3">
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-linear-to-b from-transparent via-background/60 to-background" />
        <PromptInput sendMessage={sendMessage} status={status} />
      </div>
    </div>
  );
}
