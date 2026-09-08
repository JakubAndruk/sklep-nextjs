import { UserPublic } from "@/types/user";
import { RegisterInput } from "../validators/auth";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Prisma } from "@/generated/prisma/client";

export async function createUser(
  data: RegisterInput,
): Promise<
  | { success: true; user: UserPublic }
  | { success: false; error: string; status: number }
> {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const createData: Prisma.UserCreateInput = {
      phoneNumber: data.phoneNumber,
      email: data.email,
      passwordHash: passwordHash,
      country: data.country,
    };

    const user = await prisma.user.create({
      data: createData,
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { success: true, user };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | undefined)?.join(", ");
      console.warn(`Unique constraint violated on: ${target}`);
      return {
        success: false,
        error: "Phone or email already exists",
        status: 409,
      };
    }

    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user", status: 500 };
  }
}

export async function getUserById(id: string): Promise<UserPublic | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function getUserByEmail(email: string): Promise<{
  id: string;
  phoneNumber: string;
  email: string;
  passwordHash: string;
} | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      passwordHash: true,
      country: true,
    },
  });

  return user;
}

export async function getUserByPhoneNumber(phoneNumber: string): Promise<{
  id: string;
  phoneNumber: string;
  email: string;
  passwordHash: string;
} | null> {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      passwordHash: true,
      country: true,
    },
  });

  return user;
}
