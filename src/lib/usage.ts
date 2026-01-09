import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./prisma";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const getUsageTracker = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("the user is not authenticated");
  }
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: session.user.status === "pro_user" ? 100 : 3,
    duration: 86400,
  });
  return usageTracker;
};

export const consumeCredits = async (userId: string) => {
  const usageTracker = await getUsageTracker();
  const result = usageTracker.consume(userId, 1);
  return result;
};
