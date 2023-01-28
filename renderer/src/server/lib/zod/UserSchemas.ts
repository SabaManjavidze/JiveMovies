import { z } from "zod";

export const zodEmail = z.string().email();
export const zodPassword = z.string().min(8).max(20);

export const registerSchema = z.object({
  email: zodEmail,
  password: zodPassword,
  username: z.string().min(5, "5 characters min").max(20, "20 characters max"),
  age: z.number().min(13).max(69),
  gender: z.enum(["Male", "Female", "None"]),
});
export type registerSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: zodEmail,
  password: zodPassword,
});
export type loginSchemaType = z.infer<typeof loginSchema>;
