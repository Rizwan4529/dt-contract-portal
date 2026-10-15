import { z } from "zod";
import type { LookupEntity, LookupPayload } from "@/types/lookup";

export const lookupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long"),
  image: z.string().nullable(),
});

export type LookupFormValues = z.infer<typeof lookupSchema>;

export const lookupInitialValues: LookupFormValues = { name: "", description: "", image: null };

export const toLookupFormValues = (entity: LookupEntity): LookupFormValues => ({
  name: entity.name,
  description: entity.description ?? "",
  image: entity.image ?? null,
});

// Backend requires all three keys on create and rejects empty strings: send null instead
export const toLookupPayload = (values: LookupFormValues): LookupPayload => ({
  name: values.name.trim(),
  description: values.description.trim() || null,
  image: values.image || null,
});
