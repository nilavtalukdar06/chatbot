import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { MessageContainer } from "@/components/message-container";
import { PromptProvider } from "@/components/context/prompt-provider";
import { Message } from "@/generated/prisma/browser";
import { caller } from "@/trpc/server";

export default async function Home() {
  let messages: Message[] | null = null;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  if (session) {
    const result = await caller.message.getMany();
    messages = result;
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col h-screen">
      <Navbar />
      <PromptProvider>
        <MessageContainer messages={messages} />
      </PromptProvider>
    </div>
  );
}
