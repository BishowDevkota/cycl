import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
import createMiddleware from 'next-intl/middleware';

const DEFAULT_LOCALE = "en";

// 1. Initialize the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'ne'],
  defaultLocale: 'en'
});

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const locale = request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.rewrite(rewrittenUrl);
  }

  // 2. Run next-intl middleware first to handle locale prefixes (e.g., /en/admin)
  const response = intlMiddleware(request);

  // 3. Admin Authentication Logic
  // Check if the path starts with /admin (ignoring the locale prefix)
  const isAdminPath = pathname.match(/^\/(en|ne)\/admin/) || pathname.startsWith('/admin');
  
  if (isAdminPath) {
    // Allow access to the login page without a token
    if (pathname.endsWith('/admin/login')) {
      return response;
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    // Redirect to login if no token is found
    if (!token) {
      const loginUrl = new URL(`/${pathname.split('/')[1] || 'en'}/admin/login`, request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session
    const session = await verifyAdminSession(token);
    if (!session) {
      const loginUrl = new URL(`/${pathname.split('/')[1] || 'en'}/admin/login`, request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  // Combined matcher: handles internationalized routes and the admin paths
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/', 
    '/api/:path*',
    
    // Set up a skip-list for paths that should not be internationalized
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};