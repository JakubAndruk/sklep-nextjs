import z from "zod";

export const addToCartSchema = z.object({
  productId: z
    .string({ message: "Product ID is required" })
    .min(1, { message: "Product ID cannot be empty" }),
  quantity: z.coerce
    .number({ message: "Quantity must be a valid number" })
    .int({ message: "Quantity must be a whole number" })
    .positive({ message: "Quantity must be positive" })
    .default(1),
  colorId: z.string().optional(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

export function validateAddToCartInput(body: unknown) {
  const result = addToCartSchema.safeParse(body);

  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  return { success: true as const, data: result.data };
}

export const updateCartItemSchema = z.object({
  quantity: z.coerce
    .number({ message: "Quantity must be a valid number" })
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be positive" })
    .optional(),
  note: z.string().max(280, { message: "Note is too long" }).optional(),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export function validateUpdateCartItemInput(body: unknown) {
  const result = updateCartItemSchema.safeParse(body);

  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  return { success: true as const, data: result.data };
}

export const removeCartItemsSchema = z.object({
  itemIds: z.array(z.string().min(1)).min(1, { message: "No items specified" }),
});

export function validateRemoveCartItemsInput(body: unknown) {
  const result = removeCartItemsSchema.safeParse(body);
  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }
  return { success: true as const, data: result.data };
}
