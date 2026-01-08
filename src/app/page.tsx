import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { MessageContainer } from "@/components/message-container";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col h-screen">
      <Navbar />
      <MessageContainer />
    </div>
  );
}
