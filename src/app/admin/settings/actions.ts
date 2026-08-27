"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export async function updateSignupEnabled(formData: FormData) {
  await requireAdminSession();
  const enabled = formData.get("signupEnabled") === "on";

  await prisma.appSetting.upsert({
    where: { key: "signup_enabled" },
    create: { key: "signup_enabled", value: String(enabled) },
    update: { value: String(enabled) },
  });

  revalidatePath("/admin/settings");
}

export async function updateMotivationalMessages(formData: FormData) {
  await requireAdminSession();
  const raw = String(formData.get("messages") ?? "");
  const messages = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await prisma.appSetting.upsert({
    where: { key: "motivational_messages" },
    create: { key: "motivational_messages", value: JSON.stringify(messages) },
    update: { value: JSON.stringify(messages) },
  });

  revalidatePath("/admin/settings");
}
