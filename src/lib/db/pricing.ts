import prisma from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";

const FALLBACK_PRICING = {
  shippingPrice: new Prisma.Decimal("5.00"),
  serviceFee: new Prisma.Decimal("0.50"),
  productProtectionPerUnit: new Prisma.Decimal("1.00"),
  shippingInsuranceRate: new Prisma.Decimal("0.02"),
};

export async function getPricingConfig() {
  const config = await prisma.pricingConfig.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (config) return config;

  console.warn(
    "PricingConfig not found in database - using fallback values. " +
      "Run the seed script to create the initial pricing configuration.",
  );

  return FALLBACK_PRICING;
}
