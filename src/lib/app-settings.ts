import { prisma } from "@/lib/prisma";

export async function isSignupEnabled(): Promise<boolean> {
  const setting = await prisma.appSetting.findUnique({ where: { key: "signup_enabled" } });
  if (!setting) return true;
  return setting.value === "true";
}
