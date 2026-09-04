import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/db/prisma";
import { ProductQueryParams } from "@/lib/validators/products";
import { getCategories } from "./categories";

interface GetProductsResult {
  products: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getProducts(
  filters: ProductQueryParams,
): Promise<GetProductsResult> {
  const { category, minPrice, maxPrice, sort, page, limit } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imageUrl: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    }),

    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: products.map((p) => ({ ...p, price: Number(p.price) })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      imageUrl: true,
      images: {
        select: { id: true, url: true },
        orderBy: { sortOrder: "asc" },
      },
      colors: {
        select: {
          id: true,
          name: true,
          hexValue: true,
          stock: true,
          isDefault: true,
        },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      brand: {
        select: { id: true, name: true, logoUrl: true },
      },
    },
  });

  if (!product) return null;

  const today = new Date();
  const randomDays = Math.floor(Math.random() * 7) + 1;
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + randomDays);

  return {
    ...product,
    price: Number(product.price),
    estimatedDelivery: deliveryDate.toISOString(),
  };
}

export async function getRecommendedProducts() {
  const categories = await getCategories();

  const selectedProductIds: string[] = [];

  for (const category of categories) {
    const productsInCategory = await prisma.product.findMany({
      where: { categoryId: category.id },
      select: { id: true },
    });

    if (productsInCategory.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsInCategory.length);
      selectedProductIds.push(productsInCategory[randomIndex].id);
    }
  }

  const allProducts = await prisma.product.findMany({ select: { id: true } });
  const remaining = allProducts.filter(
    (p) => !selectedProductIds.includes(p.id),
  );

  if (remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    selectedProductIds.push(remaining[randomIndex].id);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: selectedProductIds } },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return products.map((p) => ({ ...p, price: Number(p.price) }));
}
