import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { updateAddress, deleteAddress } from "@/lib/db/addresses";
import { validateUpdateAddressInput } from "@/lib/validators/address";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateUpdateAddressInput(body);

    if (!validation.success) {
      return apiError(validation.error, validation.status);
    }

    const address = await updateAddress(userId, id, validation.data);

    if (!address) return apiError("Address not found", 404);

    return apiSuccess(address, { message: "Address updated" });
  } catch (error) {
    console.error("Error updating address", error);
    return apiError("Failed to update address", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return apiError("Unauthorized", 401);

  try {
    const { id } = await params;
    const result = await deleteAddress(userId, id);

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(null, { message: "Address deleted" });
  } catch (error) {
    console.error("Error deleting address", error);
    return apiError("Failed to delete address", 500);
  }
}
