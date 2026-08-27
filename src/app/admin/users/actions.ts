"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { signupSchema } from "@/lib/validation";
import type { ActionResult } from "@/components/admin/action-form";

export async function toggleAdmin(formData: FormData): Promise<ActionResult> {
  const session = await requireAdminSession();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return { ok: false, message: "ユーザーを特定できませんでした。" };

  if (userId === session.user.id) {
    return { ok: false, message: "自分自身の管理者権限は変更できません。" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, message: "ユーザーが見つかりません。" };

  await prisma.user.update({ where: { id: userId }, data: { isAdmin: !user.isAdmin } });
  revalidatePath("/admin/users");
  return { ok: true, message: user.isAdmin ? "管理者権限を解除しました。" : "管理者権限を付与しました。" };
}

export async function deleteUser(formData: FormData): Promise<ActionResult> {
  const session = await requireAdminSession();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return { ok: false, message: "ユーザーを特定できませんでした。" };

  if (userId === session.user.id) {
    return { ok: false, message: "自分自身のアカウントはここから削除できません。" };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { ok: true, message: "ユーザーを削除しました。" };
}

export async function createUser(formData: FormData) {
  await requireAdminSession();

  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false as const, message: "このメールアドレスはすでに登録されています。" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const isAdmin = formData.get("isAdmin") === "on";

  await prisma.user.create({
    data: { email: parsed.data.email, passwordHash, displayName: parsed.data.displayName, isAdmin },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
