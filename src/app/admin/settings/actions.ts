"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import type { ActionResult } from "@/components/admin/action-form";

export async function updateSignupEnabled(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  const enabled = formData.get("signupEnabled") === "on";

  await prisma.appSetting.upsert({
    where: { key: "signup_enabled" },
    create: { key: "signup_enabled", value: String(enabled) },
    update: { value: String(enabled) },
  });

  revalidatePath("/admin/settings");
  return { ok: true, message: "保存しました。" };
}
