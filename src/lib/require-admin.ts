import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/dashboard");
  }
  return session;
}

export async function isAdminSession(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.isAdmin);
}
