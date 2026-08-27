import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .max(72, "パスワードは72文字以内で入力してください")
  .regex(/[a-zA-Z]/, "パスワードには英字を含めてください")
  .regex(/[0-9]/, "パスワードには数字を含めてください");

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("メールアドレスの形式が正しくありません"),
  password: passwordSchema,
  displayName: z
    .string()
    .trim()
    .min(1, "表示名を入力してください")
    .max(50, "表示名は50文字以内で入力してください"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
