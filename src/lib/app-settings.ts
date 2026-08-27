import { prisma } from "@/lib/prisma";

export async function isSignupEnabled(): Promise<boolean> {
  const setting = await prisma.appSetting.findUnique({ where: { key: "signup_enabled" } });
  if (!setting) return true;
  return setting.value === "true";
}

export async function getMotivationalMessages(): Promise<string[]> {
  const setting = await prisma.appSetting.findUnique({ where: { key: "motivational_messages" } });
  if (!setting) return [];
  try {
    const parsed = JSON.parse(setting.value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function pickMotivationalMessage(seed: number): Promise<string | null> {
  const messages = await getMotivationalMessages();
  if (messages.length === 0) return null;
  return messages[seed % messages.length];
}
