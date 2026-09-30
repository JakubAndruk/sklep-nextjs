import { apiError, apiSuccess } from "@/lib/utils/response";
import { createUser } from "@/lib/db/users";
import { validateRegisterInput } from "@/lib/validators/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRegisterInput(body);

    if (!validation.success)
      return apiError(validation.error, validation.status);

    const result = await createUser(validation.data);

    if (!result.success) return apiError(result.error, result.status);

    return apiSuccess(
      result.user,
      { message: "Registration successful. Please log in." },
      201,
    );
  } catch (error) {
    console.error("Unexpected error in register:", error);
    return apiError("Internal server error", 500);
  }
}
