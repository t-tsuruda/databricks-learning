"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export async function toggleAdmin(formData: FormData) {
  const session = await requireAdminSession();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  if (userId === session.user.id) {
    throw new Error("自分自身の管理者権限は変更できません。");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.user.update({ where: { id: userId }, data: { isAdmin: !user.isAdmin } });
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdminSession();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  if (userId === session.user.id) {
    throw new Error("自分自身のアカウントはここから削除できません。");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
