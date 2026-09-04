import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER_IMAGE = "https://i.ibb.co/FdYHxt0/rexus-xierra-x16.png";

type ProductColorInput = {
  name: string;
  hexValue: string;
  stock: number;
  isDefault?: boolean;
};

function blackColor(stock: number, isDefault = true): ProductColorInput {
  return { name: "Black", hexValue: "#0A0A0A", stock, isDefault };
}

function whiteColor(stock: number, isDefault = false): ProductColorInput {
  return { name: "White", hexValue: "#FAFAFA", stock, isDefault };
}

const categories = [
  {
    name: "Mouse",
    slug: "mouse",
    description: "Computer mice for work, productivity and competitive gaming.",
    exploreInfo: "Discover our mice",
  },
  {
    name: "Monitor",
    slug: "monitor",
    description:
      "Monitors for gaming, creative work and everyday productivity.",
    exploreInfo: "Discover our monitors",
  },
  {
    name: "Headphone",
    slug: "headphone",
    description: "Wired and wireless headphones for music, calls and gaming.",
    exploreInfo: "Discover our headphones",
  },
  {
    name: "Keyboard",
    slug: "keyboard",
    description: "Mechanical and membrane keyboards for typing and gaming.",
    exploreInfo: "Discover our keyboards",
  },
  {
    name: "Webcam",
    slug: "webcam",
    description: "Webcams for video calls, streaming and hybrid work.",
    exploreInfo: "Discover our webcams",
  },
];

const brands = [
  { name: "Logitech", logoUrl: "https://i.ibb.co/p6QRVyw0/Logitech.png" },
  { name: "Razer", logoUrl: "https://i.ibb.co/5g2dJNGS/Razer.png" },
  {
    name: "SteelSeries",
    logoUrl: "https://i.ibb.co/SDdsz9zb/Steel-Series.png",
  },
  { name: "Corsair", logoUrl: "https://i.ibb.co/G4vgMc0G/Corsair.png" },
  { name: "HyperX", logoUrl: "https://i.ibb.co/ynzrbFRw/Hyper-X.png" },
  { name: "Roccat", logoUrl: "https://i.ibb.co/d0PC6jPx/Roccat.png" },
  { name: "Dell", logoUrl: "https://i.ibb.co/MxwMLmJp/Dell.png" },
  { name: "LG", logoUrl: "https://i.ibb.co/fzpNWVxt/LG.png" },
  { name: "Samsung", logoUrl: "https://i.ibb.co/B5vcryP7/Samsung.png" },
  { name: "ASUS", logoUrl: "https://i.ibb.co/vvD2jC0c/ASUS.png" },
  { name: "BenQ", logoUrl: "https://i.ibb.co/20yCzBPT/Ben-Q.png" },
  { name: "Acer", logoUrl: "https://i.ibb.co/RTg1GN8h/Acer.png" },
  { name: "Sony", logoUrl: "https://i.ibb.co/8g6GQQS1/Sony.png" },
  { name: "Bose", logoUrl: "https://i.ibb.co/C3gpDFvc/Bose.png" },
  { name: "Sennheiser", logoUrl: "https://i.ibb.co/JRWnPZQv/Sennheiser.png" },
  { name: "JBL", logoUrl: "https://i.ibb.co/6KvZ1H4/JBL.png" },
  { name: "Keychron", logoUrl: "https://i.ibb.co/cpM43FV/Keychron.png" },
  { name: "Ducky", logoUrl: "https://i.ibb.co/7tR7GjwH/Ducky.png" },
  { name: "Microsoft", logoUrl: "https://i.ibb.co/W4pYNHMF/Microsoft.png" },
  { name: "Elgato", logoUrl: "https://i.ibb.co/nsfFZJfM/Elgato.png" },
  { name: "Insta360", logoUrl: "https://i.ibb.co/5xLr6c0Z/insta360.png" },
  { name: "AVerMedia", logoUrl: "https://i.ibb.co/rKb7QDK9/AVer-Media.png" },
];

const products = [
  // ===== Mouse =====
  {
    name: "Logitech G Pro X Superlight 2",
    description:
      "Ultra-lightweight wireless gaming mouse with a high-precision sensor and Lightspeed wireless for esports players.",
    price: "699.99",
    imageUrl: "https://i.ibb.co/zH4C7XH1/Logitech-PRO-X-SUPERLIGHT.png",
    additionalImages: [
      "https://i.ibb.co/xtCL7DgP/Logitech-PRO-X-SUPERLIGHT-2.png",
      "https://i.ibb.co/mFFRpsHd/Logitech-PRO-X-SUPERLIGHT-3.png",
    ],
    categorySlug: "mouse",
    brandName: "Logitech",
    colors: [
      blackColor(15),
      whiteColor(10),
      { name: "Red", hexValue: "#FF0000", stock: 5 },
    ],
  },
  {
    name: "Razer DeathAdder V4 Pro",
    description:
      "Ergonomic wireless gaming mouse with optical switches and extremely low click latency.",
    price: "649.99",
    imageUrl: "https://i.ibb.co/GQTFyPFp/Razer-Death-Adder-V4-Pro.png",
    additionalImages: [
      "https://i.ibb.co/39g1Xwcd/Razer-Death-Adder-V4-Pro-2.png",
    ],
    categorySlug: "mouse",
    brandName: "Razer",
    colors: [blackColor(30), whiteColor(15)],
  },
  {
    name: "SteelSeries Rival 5 Wireless",
    description:
      "Multi-genre wireless gaming mouse with programmable side buttons and customizable RGB lighting.",
    price: "529.00",
    imageUrl: "https://i.ibb.co/MkkBf73D/Steel-Series-Rival-5.png",
    additionalImages: ["https://i.ibb.co/G4vbfGtq/Steel-Series-Rival-5-2.png"],
    categorySlug: "mouse",
    brandName: "SteelSeries",
    colors: [blackColor(40)],
  },
  {
    name: "Corsair M65 RGB Ultra",
    description:
      "Adjustable-weight gaming mouse with a high-DPI sensor and durable aluminum frame.",
    price: "399.99",
    imageUrl: "https://i.ibb.co/hFH9fJ45/Corsair-M65-RGB-Ultra.png",
    additionalImages: [],
    categorySlug: "mouse",
    brandName: "Corsair",
    colors: [blackColor(35)],
  },
  {
    name: "HyperX Pulsefire Haste 2",
    description:
      "Lightweight wired gaming mouse with a flexible paracord-style cable and fast PTFE skates.",
    price: "349.99",
    imageUrl: "https://i.ibb.co/d0F1Wgr9/Hyper-X-Pulsefire-Haste-2-2.png",
    additionalImages: [
      "https://i.ibb.co/CpCJfW0P/Hyper-X-Pulsefire-Haste-2.png",
    ],
    categorySlug: "mouse",
    brandName: "HyperX",
    colors: [blackColor(50), whiteColor(10)],
  },
  {
    name: "Roccat Kone XP Air",
    description:
      "Wireless gaming mouse with 3D RGB lighting and multiple Easy-Shift programmable buttons.",
    price: "579.00",
    imageUrl: "https://i.ibb.co/cXT9B9cD/Roccat-Kone-XP-Air-1.png",
    additionalImages: ["https://i.ibb.co/Dfcph9bf/Roccat-Kone-XP-Air-2.png"],
    categorySlug: "mouse",
    brandName: "Roccat",
    colors: [blackColor(20), whiteColor(25)],
  },

  // ===== Monitor =====
  {
    name: "Dell UltraSharp U2723QE",
    description: `A 27" monitor featuring the world's first enhanced IPS Black with 3000:1 contrast ratio with enhanced eye comfort from improved ComfortView Plus, an ambient light sensor and 120Hz refresh rate.`,
    price: "2999.00",
    imageUrl: "https://i.ibb.co/GYtwGFB/Dell-Ultra-Sharp-U2723-QE-1.png",
    additionalImages: [
      "https://i.ibb.co/1YcfSCNF/Dell-Ultra-Sharp-U2723-QE-2.png",
    ],
    categorySlug: "monitor",
    brandName: "Dell",
    colors: [whiteColor(15)],
  },
  {
    name: "LG UltraGear 27GN950-B",
    description:
      '27" 4K gaming monitor with 144 Hz refresh rate and G-Sync Compatible support.',
    price: "3299.00",
    imageUrl: "https://i.ibb.co/pvDCX4LK/LG-Ultra-Gear-27-GN950-B-1.png",
    additionalImages: [
      "https://i.ibb.co/4w8z4CCH/LG-Ultra-Gear-27-GN950-B-2.png",
    ],
    categorySlug: "monitor",
    brandName: "LG",
    colors: [blackColor(10)],
  },
  {
    name: 'Samsung Odyssey G7 32"',
    description:
      '32" curved QHD gaming monitor with 240 Hz refresh rate and a high-contrast VA panel.',
    price: "2799.00",
    imageUrl: "https://i.ibb.co/PGZM2ppM/Samsung-Odyssey-G7-32-1.png",
    additionalImages: ["https://i.ibb.co/7xv4GG9j/Samsung-Odyssey-G7-32-2.png"],
    categorySlug: "monitor",
    brandName: "Samsung",
    colors: [blackColor(12)],
  },
  {
    name: "ASUS TUF Gaming VG27AQ",
    description:
      '27" QHD monitor with 165 Hz refresh rate and ELMB Sync for clear motion in fast games.',
    price: "1999.00",
    imageUrl: "https://i.ibb.co/8nV9wrMr/ASUS-TUF-Gaming-VG27-AQ.png",
    additionalImages: [],
    categorySlug: "monitor",
    brandName: "ASUS",
    colors: [blackColor(18)],
  },
  {
    name: "BenQ PD2705U",
    description:
      '27" 4K designer monitor with factory-calibrated colors for photo and video editing.',
    price: "2899.00",
    imageUrl: "https://i.ibb.co/fG15bZZ9/Ben-Q-PD2705-U.png",
    additionalImages: [],
    categorySlug: "monitor",
    brandName: "BenQ",
    colors: [blackColor(8)],
  },
  {
    name: "Acer Nitro XV272U",
    description:
      '27" QHD gaming monitor with a fast IPS panel, 170 Hz refresh rate and slim bezels.',
    price: "1699.00",
    imageUrl: "https://i.ibb.co/CCnVpxK/Acer-Nitro-XV272-U-1.png",
    additionalImages: ["https://i.ibb.co/MD4bnRNb/Acer-Nitro-XV272-U-2.png"],
    categorySlug: "monitor",
    brandName: "Acer",
    colors: [blackColor(20)],
  },

  // ===== Headphone =====
  {
    name: "Sony WH-1000XM5",
    description:
      "Premium wireless over-ear headphones with industry-leading noise cancelling and long battery life.",
    price: "1699.00",
    imageUrl: "https://i.ibb.co/3yB81Z9H/Sony-WH-1000-XM5-1.png",
    additionalImages: ["https://i.ibb.co/FbM5k62C/Sony-WH-1000-XM5-2.png"],
    categorySlug: "headphone",
    brandName: "Sony",
    colors: [blackColor(25)],
  },
  {
    name: "Bose QuietComfort 45",
    description:
      "Lightweight over-ear headphones focused on comfort and strong active noise cancelling.",
    price: "1499.00",
    imageUrl: "https://i.ibb.co/JjZjT1pq/Bose-Quiet-Comfort-45-1.png",
    additionalImages: [],
    categorySlug: "headphone",
    brandName: "Bose",
    colors: [whiteColor(18)],
  },
  {
    name: "Sennheiser HD 560S",
    description:
      "Open-back wired headphones with neutral, reference-style sound for critical listening.",
    price: "999.00",
    imageUrl: "https://i.ibb.co/zTSB7Gwk/Sennheiser-HD-560-S-1.png",
    additionalImages: ["https://i.ibb.co/20bP207Y/Sennheiser-HD-560-S-2.png"],
    categorySlug: "headphone",
    brandName: "Sennheiser",
    colors: [blackColor(12)],
  },
  {
    name: "JBL Quantum 400",
    description:
      "Wired gaming headset with spatial sound and a boom microphone for clear team communication.",
    price: "449.00",
    imageUrl: "https://i.ibb.co/4nQQ6tLc/JBL-Quantum-400-1.png",
    additionalImages: ["https://i.ibb.co/Dg1WzZgW/JBL-Quantum-400-2.png"],
    categorySlug: "headphone",
    brandName: "JBL",
    colors: [blackColor(35)],
  },
  {
    name: "SteelSeries Arctis Nova 7",
    description:
      "Multi-platform wireless gaming headset with low-latency connection and balanced sound.",
    price: "899.00",
    imageUrl: "https://i.ibb.co/ymDfwhmb/Steel-Series-Arctis-Nova-7-3.png",
    additionalImages: [
      "https://i.ibb.co/Kp17wcTv/Steel-Series-Arctis-Nova-7.png",
      "https://i.ibb.co/PvpmndYr/Steel-Series-Arctis-Nova-7-2.png",
    ],
    categorySlug: "headphone",
    brandName: "SteelSeries",
    colors: [
      { name: "Red", hexValue: "#BF0A30", stock: 15 },
      blackColor(22),
      whiteColor(32),
    ],
  },
  {
    name: "HyperX Cloud Alpha Wireless",
    description:
      "Wireless gaming headset with very long battery life and powerful bass.",
    price: "799.00",
    imageUrl: "https://i.ibb.co/60TgWFRG/Hyper-X-Cloud-Alpha-Wireless.png",
    additionalImages: [],
    categorySlug: "headphone",
    brandName: "HyperX",
    colors: [blackColor(28)],
  },

  // ===== Keyboard =====
  {
    name: "Keychron K6 Pro",
    description:
      "65% wireless mechanical keyboard with hot-swappable switches and multi-device Bluetooth.",
    price: "649.00",
    imageUrl: "https://i.ibb.co/j9bQzHQ2/Keychron-K6-Pro.png",
    additionalImages: [],
    categorySlug: "keyboard",
    brandName: "Keychron",
    colors: [blackColor(30)],
  },
  {
    name: "Ducky One 3 TKL",
    description:
      "TKL mechanical keyboard with high-quality stabilizers and colorful case designs.",
    price: "699.00",
    imageUrl: "https://i.ibb.co/ymBxnGC4/Ducky-One-3-TKL-2.png",
    additionalImages: ["https://i.ibb.co/TBbdF9LJ/Ducky-One-3-TKL.png"],
    categorySlug: "keyboard",
    brandName: "Ducky",
    colors: [whiteColor(20), blackColor(18)],
  },
  {
    name: "Corsair K70 RGB PRO",
    description:
      "Full-size gaming keyboard with per-key RGB, dedicated media keys and an aluminum top plate.",
    price: "749.00",
    imageUrl: "https://i.ibb.co/9m7BGHnF/Corsair-K70-RGB-PRO.png",
    additionalImages: ["https://i.ibb.co/zT6kHyf6/Corsair-K70-RGB-PRO-2.png"],
    categorySlug: "keyboard",
    brandName: "Corsair",
    colors: [blackColor(20), whiteColor(8)],
  },
  {
    name: "Razer Huntsman V3 TKL",
    description:
      "Tenkeyless optical-switch keyboard designed for ultra-fast key actuation.",
    price: "799.00",
    imageUrl: "https://i.ibb.co/B5vMgCjv/Razer-Huntsman-V3-TKL.png",
    additionalImages: ["https://i.ibb.co/KcsgjszY/Razer-Huntsman-V3-TKL2.png"],
    categorySlug: "keyboard",
    brandName: "Razer",
    colors: [blackColor(16), whiteColor(12)],
  },
  {
    name: "Logitech G915 TKL Lightspeed",
    description:
      "Low-profile wireless mechanical keyboard with a slim aluminum chassis.",
    price: "999.00",
    imageUrl: "https://i.ibb.co/60yFKGgY/Logitech-G915-TKL-Lightspeed-1.png",
    additionalImages: [
      "https://i.ibb.co/mrzGdLDw/Logitech-G915-TKL-Lightspeed-2.png",
      "https://i.ibb.co/WW3CXyhh/Logitech-G915-TKL-Lightspeed-3.png",
    ],
    categorySlug: "keyboard",
    brandName: "Logitech",
    colors: [blackColor(14), whiteColor(16)],
  },
  {
    name: "SteelSeries Apex Pro TKL",
    description:
      "TKL keyboard with adjustable actuation and a small OLED display for quick settings.",
    price: "949.00",
    imageUrl: "https://i.ibb.co/WNFFGThP/Steel-Series-Apex-Pro-TKL-1.png",
    additionalImages: [
      "https://i.ibb.co/zHbKnnj3/Steel-Series-Apex-Pro-TKL-2.png",
    ],
    categorySlug: "keyboard",
    brandName: "SteelSeries",
    colors: [blackColor(10)],
  },

  // ===== Webcam =====
  {
    name: "Logitech C920x HD Pro",
    description:
      "Popular 1080p webcam for video calls and basic streaming setups.",
    price: "399.00",
    imageUrl: "https://i.ibb.co/xqv4h9mW/Logitech-C920x-HD-Pro-1.png",
    additionalImages: ["https://i.ibb.co/3mgYVxGT/Logitech-C920x-HD-Pro-2.png"],
    categorySlug: "webcam",
    brandName: "Logitech",
    colors: [blackColor(40)],
  },
  {
    name: "Razer Kiyo Pro",
    description:
      "1080p webcam with a wide field of view, HDR and good low-light performance for streamers.",
    price: "749.00",
    imageUrl: "https://i.ibb.co/LDgPCtKc/Razer-Kiyo-Pro.png",
    additionalImages: [],
    categorySlug: "webcam",
    brandName: "Razer",
    colors: [blackColor(15)],
  },
  {
    name: "Microsoft Modern Webcam",
    description:
      "Simple 1080p office webcam with a built-in privacy shutter for online meetings.",
    price: "299.00",
    imageUrl: "https://i.ibb.co/BHYFRNmP/Microsoft-Modern-Webcam.png",
    additionalImages: [],
    categorySlug: "webcam",
    brandName: "Microsoft",
    colors: [blackColor(30)],
  },
  {
    name: "Elgato Facecam MK.2",
    description:
      "1080p 60 fps webcam designed for content creators and streamers.",
    price: "899.00",
    imageUrl: "https://i.ibb.co/N6mrKHJv/Elgato-Facecam-MK-2-1.png",
    additionalImages: [],
    categorySlug: "webcam",
    brandName: "Elgato",
    colors: [blackColor(12)],
  },
  {
    name: "Insta360 Link",
    description:
      "4K PTZ webcam on a gimbal with AI face tracking and gesture control.",
    price: "1299.00",
    imageUrl: "https://i.ibb.co/S7K6g0b0/Insta360-Link.png",
    additionalImages: [],
    categorySlug: "webcam",
    brandName: "Insta360",
    colors: [blackColor(8)],
  },
  {
    name: "AVerMedia PW315",
    description:
      "1080p 60 fps webcam with a wide-angle lens and dual microphones.",
    price: "549.00",
    imageUrl: "https://i.ibb.co/YTdJkHnj/AVer-Media-PW315.png",
    additionalImages: [],
    categorySlug: "webcam",
    brandName: "AVerMedia",
    colors: [blackColor(18)],
  },
];

function normalizeColors(colors: ProductColorInput[]): ProductColorInput[] {
  if (colors.length === 0) return colors;

  const hasDefault = colors.some((c) => c.isDefault);
  if (hasDefault) return colors;

  return colors.map((c, index) => ({ ...c, isDefault: index === 0 }));
}

async function createProductWithColors(data: {
  name: string;
  description: string;
  price: string;
  stock?: number;
  imageUrl: string;
  additionalImages?: string[];
  categoryId: string;
  brandId: string;
  colors?: ProductColorInput[];
}) {
  const { additionalImages, colors, stock, ...productData } = data;
  const normalizedColors = normalizeColors(colors ?? []);

  const hasColors = normalizedColors.length > 0;
  const resolvedStock = hasColors
    ? normalizedColors.reduce((sum, c) => sum + c.stock, 0)
    : stock;

  if (resolvedStock === undefined) {
    throw new Error(
      `Product "${data.name}" has no colors and no explicit stock value.`,
    );
  }

  const product = await prisma.product.create({
    data: { ...productData, stock: resolvedStock },
  });

  if (additionalImages && additionalImages.length > 0) {
    await prisma.productImage.createMany({
      data: additionalImages.map((url, index) => ({
        productId: product.id,
        url,
        sortOrder: index,
      })),
    });
  }

  if (hasColors) {
    await prisma.productColor.createMany({
      data: normalizedColors.map((color) => ({
        productId: product.id,
        name: color.name,
        hexValue: color.hexValue,
        stock: color.stock,
        isDefault: color.isDefault ?? false,
      })),
    });
  }

  return product;
}

async function main() {
  console.log("Seeding: categories...");
  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          image: PLACEHOLDER_IMAGE,
          exploreInfo: cat.exploreInfo,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: PLACEHOLDER_IMAGE,
          exploreInfo: cat.exploreInfo,
        },
      }),
    ),
  );

  console.log("Seeding: brands...");
  const createdBrands = await Promise.all(
    brands.map((brand) =>
      prisma.brand.upsert({
        where: { name: brand.name },
        update: { logoUrl: brand.logoUrl },
        create: { name: brand.name, logoUrl: brand.logoUrl },
      }),
    ),
  );

  // Czyścimy zależne dane – tylko na dev/test!
  console.log("Seeding: cleaning data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  console.log("Seeding: products...");

  const categoryBySlug: Record<string, (typeof createdCategories)[number]> =
    Object.fromEntries(createdCategories.map((cat) => [cat.slug, cat]));

  const brandByName: Record<string, (typeof createdBrands)[number]> =
    Object.fromEntries(createdBrands.map((brand) => [brand.name, brand]));

  let productCount = 0;

  for (const p of products) {
    const category = categoryBySlug[p.categorySlug];
    const brand = brandByName[p.brandName];

    if (!category || !brand) {
      console.warn(
        `Skipping product "${p.name}" – missing category or brand (categorySlug=${p.categorySlug}, brandName=${p.brandName}).`,
      );
      continue;
    }

    await createProductWithColors({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      additionalImages: p.additionalImages,
      categoryId: category.id,
      brandId: brand.id,
      colors: p.colors,
    });

    productCount++;
  }

  console.log(`Utworzono ${productCount} produktów.`);

  console.log("Seeding: test user...");
  const passwordHash = await bcrypt.hash("Password123", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      phoneNumber: "+48123456789",
      email: "test@example.com",
      passwordHash,
      country: "PL",
    },
  });

  console.log("Seeding: pricing config...");
  const existingPricing = await prisma.pricingConfig.findFirst();
  if (!existingPricing) {
    await prisma.pricingConfig.create({
      data: {
        shippingPrice: 5.0,
        serviceFee: 0.5,
        productProtectionPerUnit: 1.0,
        shippingInsuranceRate: 0.02,
      },
    });
  }

  console.log("Seed zakończony.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
