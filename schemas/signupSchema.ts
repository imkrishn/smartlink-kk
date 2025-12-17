import { z } from "zod";

const signupSchema = z
  .object({
    email: z.email("Invalid email"),
    otp: z.string(),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[a-z]/, "At least one lowercase")
      .regex(/[A-Z]/, "At least one uppercase")
      .regex(/[0-9]/, "At least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signupSchema;
