import { NextResponse } from "next/server";

// Export an asynchronous middleware function that processes incoming requests
export async function middleware(request) {
  // Retrieve the token value from the cookies in the request, if it exists
  let user = request.cookies.get("@ACCESS_TOKEN")?.value;
  let path = request.nextUrl.pathname;
  const authRoutes = [
    "/login",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/company-kyc",
    "/ngo-kyc",
  ];
  // if (user && path.startsWith("/login")) {
  //   if (user?.role === "ngo" && !path.startsWith("/ngo")) {
  //     return NextResponse.redirect(new URL("/ngo/dashboard", request.url));
  //   }
  //   if (
  //     user?.role === "campaign-manager" &&
  //     !path.startsWith("/campaign_manager")
  //   ) {
  //     return NextResponse.redirect(
  //       new URL("/campaign-manager/events", request.url)
  //     );
  //   }
  //   if (user?.role === "admin" && !path.startsWith("/admin")) {
  //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  //   }
  //   if (user?.role === "company" && !path.startsWith("/company")) {
  //     return NextResponse.redirect(new URL("/company/dashboard", request.url));
  //   }
  // }

  if (!user && !authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && typeof user === "string") {
    try {
      user = JSON.parse(user);
    } catch (error) {
      console.error("Error parsing user token:", error);
      user = null;
    }

    if (user?.role === "ngo" && !path.startsWith("/ngo")) {
      if(path.startsWith('/notifications')){
        return NextResponse.redirect(new URL("/ngo/notifications", request.url));
      }
      return NextResponse.redirect(new URL("/ngo/dashboard", request.url));
    }
    if (
      user?.role === "campaign_manager" &&
      !path.startsWith("/campaign-manager")
    ) {
      if(path.startsWith('/notifications')){
        return NextResponse.redirect(new URL("/campaign-manager/notifications", request.url));
      }
      return NextResponse.redirect(
        new URL("/campaign-manager/campaign", request.url)
      );
    }
    if (user?.role === "admin" && !path.startsWith("/admin")) {
      if(path.startsWith('/notifications')){
        return NextResponse.redirect(new URL("/admin/notifications", request.url));
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (user?.role === "company" && !path.startsWith("/company")) {
      if(path.startsWith('/notifications')){
        return NextResponse.redirect(new URL("/company/notifications", request.url));
      }
      return NextResponse.redirect(new URL("/company/dashboard", request.url));
    }
  }

  // If no token or route is not protected, allow the request to proceed
  return NextResponse.next();
}

// Updated matcher configuration to exclude certain paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - firebase-messaging-sw.js (service worker)
     * - firebase-cloud-messaging-push-scope (Firebase FCM)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|firebase-messaging-sw.js|firebase-cloud-messaging-push-scope).*)",
    "/admin/:path*",
    "/company/:path*",
    "/ngo/:path*",
    "/login",
  ],
};
