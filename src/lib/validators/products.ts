import { z } from "zod";

export const sortOptions = ["newest", "price_asc", "price_desc"] as const;
export type SortOption = (typeof sortOptions)[number];

const categoryListSchema = z
  .string()
  .optional()
  .transform((value) =>
    value
      ? value
          .split(",")
          .map((slug) => slug.trim())
          .filter(Boolean)
      : undefined,
  );

export const productQuerySchema = z.object({
  category: categoryListSchema,

  minPrice: z.coerce
    .number()
    .min(0, { message: "minPrice cannot be negative" })
    .optional(),
  maxPrice: z.coerce
    .number()
    .min(1, { message: "maxPrice must be a positive number" })
    .optional(),
  sort: z.enum(sortOptions).optional().default("newest"),
  page: z.coerce.number().int().positive("Page must be positive").default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
});

export function validateProductQuery(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const result = productQuerySchema.safeParse(searchParams);

  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  const { minPrice, maxPrice } = result.data;

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return {
      success: false as const,
      error: "minPrice cannot be greater than maxPrice",
      status: 400,
    };
  }

  return { success: true as const, data: result.data };
}

export type ProductQueryParams = z.infer<typeof productQuerySchema>;
