import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (req.auth) {
    return;
  }

  const loginUrl = new URL("/masuk", req.nextUrl.origin);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
  );

  return Response.redirect(loginUrl);
});

export const config = {
  matcher: ["/admin/:path*", "/siswa/:path*"],
};
