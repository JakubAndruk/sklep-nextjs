import { z } from "zod";

export const newAddressSchema = z.object({
  name: z.string().trim().min(1, { message: "Address name is required" }),
  street: z.string().trim().min(1, { message: "Street is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  province: z.string().trim().min(1, { message: "Province is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  setAsDefault: z.boolean().optional().default(false),
});

export type NewAddressInput = z.infer<typeof newAddressSchema>;

export function validateNewAddressInput(body: unknown) {
  const result = newAddressSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    result.error.issues.forEach((err) => {
      const field = err.path.join(".") || "body";
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(err.message);
    });
    return { success: false as const, error: fieldErrors, status: 400 };
  }

  return { success: true as const, data: result.data };
}

export const updateAddressSchema = newAddressSchema.partial();

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

export function validateUpdateAddressInput(body: unknown) {
  const result = updateAddressSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    result.error.issues.forEach((err) => {
      const field = err.path.join(".") || "body";
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(err.message);
    });
    return { success: false as const, error: fieldErrors, status: 400 };
  }

  return { success: true as const, data: result.data };
}
