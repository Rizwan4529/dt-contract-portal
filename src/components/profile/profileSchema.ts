import { z } from "zod";
import type { User } from "@/types/user";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  profileImage: z.string().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const toProfileFormValues = (user: User | null): ProfileFormValues => ({
  name: user?.name ?? "",
  profileImage: user?.profileImage ?? null,
});
