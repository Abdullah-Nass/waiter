import { Role } from "@prisma/client";
import z from "zod";

export const staffSchema = z.object({
  name: z.string().trim().min(2, "errors.shortName").max(50, "errors.longName"),
  email: z
    .string()
    .trim()
    .email("errors.wrongEmail")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, "errors.shortPasswrod")
    .max(100, "errors.longPassword"),
  role: z.enum(Role),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
