import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicPageRoutes = ["/login", "/register"];
const publicApiPrefixes = [
  "/api/auth",
  "/api/products",
  "/api/categories",
  "/api/brands",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApi = publicApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isPublicPage = publicPageRoutes.includes(pathname);

  if (isApiRoute) {
    if (!isLoggedIn && !isPublicApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isPublicPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
