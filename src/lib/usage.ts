import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./prisma";

export const getUsageTracker = (plan: "free_user" | "pro_user") => {
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: plan === "pro_user" ? 100 : 3,
    duration: 86400,
  });
  return usageTracker;
};

export const consumeCredits = async (
  userId: string,
  plan: "free_user" | "pro_user"
) => {
  const usageTracker = getUsageTracker(plan);
  const result = await usageTracker.consume(userId, 1);
  return result;
};
