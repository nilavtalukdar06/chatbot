import { LoginButton } from "@/components/auth/login";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/");
  }

  return (
    <div className="p-4 h-screen w-full flex justify-center items-center">
      <LoginButton />
    </div>
  );
}
