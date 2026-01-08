import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { MessageContainer } from "@/components/message-container";
import { PromptProvider } from "@/components/context/prompt-provider";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  if (session) {
    void queryClient.prefetchQuery(trpc.message.getMany.queryOptions());
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col h-screen">
      <Navbar />
      <PromptProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<Loading />}>
            <MessageContainer />
          </Suspense>
        </HydrationBoundary>
      </PromptProvider>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-start py-4">
      <p className="text-muted-foreground animate-pulse">Loading Messages</p>
    </div>
  );
}
