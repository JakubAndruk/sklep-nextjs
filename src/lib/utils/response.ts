import { NextResponse } from "next/server";

export function apiSuccess<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(
    { success: true, data, meta: meta ?? null },
    { status },
  );
}

export function apiError(
  error: string | Record<string, unknown> | Array<unknown>,
  status: number,
) {
  return NextResponse.json({ success: false, error }, { status });
}
