import { z } from "zod";
import { newAddressSchema } from "@/lib/validators/address";

export const createOrderSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("existing"),
    addressId: z.string().min(1, { message: "Address ID is required" }),
    withProductProtection: z.boolean().default(true),
  }),
  z.object({
    type: z.literal("new"),
    newAddress: newAddressSchema,
    withProductProtection: z.boolean().default(true),
  }),
]);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export function validateCreateOrderInput(body: unknown) {
  const result = createOrderSchema.safeParse(body);

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
