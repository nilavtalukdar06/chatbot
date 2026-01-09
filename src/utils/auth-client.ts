import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [polarClient(), inferAdditionalFields<typeof auth>()],
});
