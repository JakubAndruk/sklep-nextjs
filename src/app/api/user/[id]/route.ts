import { auth } from "@/auth";
import { apiError, apiSuccess } from "@/lib/utils/response";
import { getUserById } from "@/lib/db/users";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) return apiError("Unauthorized", 401);

  const { id } = await params;

  if (id !== sessionUserId) {
    return apiError("Forbidden", 403);
  }

  try {
    const user = await getUserById(id);

    if (!user) return apiError("User not found", 404);

    return apiSuccess(user);
  } catch (error) {
    console.error("Error fetching user", error);
    return apiError("Failed to fetch user", 500);
  }
}
