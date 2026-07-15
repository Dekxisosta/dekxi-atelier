import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAdmin = !!user && ADMIN_USER_IDS.includes(user.id);
  const isDashboard = request.nextUrl.pathname.startsWith("/admin/dashboard");
  const isLoginTab =
    request.nextUrl.pathname === "/" &&
    request.nextUrl.searchParams.get("tab") === "admin";

  if (isDashboard && !isAdmin) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("tab", "admin");
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginTab && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/admin/:path*"]
};