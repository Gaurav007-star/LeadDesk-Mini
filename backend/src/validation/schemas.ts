import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  budgetRange: z.enum(["under-1k", "1k-5k", "5k-10k", "10k-plus"], {
    message: "Invalid budget range",
  }),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export const statusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"], {
    message: "Invalid status",
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
