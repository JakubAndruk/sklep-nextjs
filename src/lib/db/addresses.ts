import prisma from "@/lib/db/prisma";
import type { NewAddressInput } from "@/lib/validators/address";

const addressSelect = {
  id: true,
  name: true,
  street: true,
  city: true,
  province: true,
  postalCode: true,
  country: true,
  isDefault: true,
} as const;

export async function getAddressesByUserId(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    select: addressSelect,
  });
}

export async function getAddressById(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { ...addressSelect, userId: true },
  });

  if (!address || address.userId !== userId) return null;

  const { userId: _userId, ...rest } = address;
  return rest;
}

export async function createAddress(userId: string, data: NewAddressInput) {
  const existingAddressesCount = await prisma.address.count({
    where: { userId },
  });

  const shouldBeDefault = data.setAsDefault || existingAddressesCount === 0;

  if (shouldBeDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      name: data.name,
      street: data.street,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: shouldBeDefault,
    },
    select: addressSelect,
  });

  return address;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: NewAddressInput,
) {
  const existing = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) return null;

  if (data.setAsDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const { setAsDefault, ...fields } = data;

  const address = await prisma.address.update({
    where: { id: addressId },
    data: {
      ...fields,
      ...(setAsDefault ? { isDefault: true } : {}),
    },
    select: addressSelect,
  });

  return address;
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true, isDefault: true },
  });

  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "Address not found", status: 404 };
  }

  await prisma.address.delete({ where: { id: addressId } });

  if (existing.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true },
    });

    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { success: true as const };
}
