import { createServerClient } from "@supabase/ssr";
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
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

  console.log("MIDDLEWARE CHECK:", {
    path: request.nextUrl.pathname,
    userId: user?.id,
    adminIds: ADMIN_USER_IDS
  });

  const isDashboard = request.nextUrl.pathname.startsWith("/admin/dashboard");
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (isDashboard && (!user || !ADMIN_USER_IDS.includes(user.id))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLogin && user && ADMIN_USER_IDS.includes(user.id)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
