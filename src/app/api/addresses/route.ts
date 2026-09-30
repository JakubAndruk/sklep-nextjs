import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { createAddress, getAddressesByUserId } from "@/lib/db/addresses";
import { validateNewAddressInput } from "@/lib/validators/address";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const addresses = await getAddressesByUserId(userId);
    return apiSuccess(addresses);
  } catch (error) {
    console.error("Error fetching addresses", error);
    return apiError("Failed to fetch addresses", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const validation = validateNewAddressInput(body);

    if (!validation.success) {
      return apiError(validation.error, validation.status);
    }

    const address = await createAddress(userId, validation.data);
    return apiSuccess(address, { message: "Address created" }, 201);
  } catch (error) {
    console.error("Error creating address", error);
    return apiError("Failed to create address", 500);
  }
}
