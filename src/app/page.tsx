import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LogoutButton } from "@/components/auth/logout";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="p-4">
      <LogoutButton />
    </div>
  );
}
