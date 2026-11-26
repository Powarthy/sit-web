import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const [, segment] = request.nextUrl.pathname.split("/");
  headers.set("x-site-locale", segment === "en" || segment === "fi" ? segment : "fr");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api/|_next/|images/|icon.png|favicon.ico|robots.txt|sitemap.xml).*)"],
};
