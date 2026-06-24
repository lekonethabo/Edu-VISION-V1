import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The Edu-VISION portal is a client-side SPA rendered at the root route.
// Authentication is handled via server actions within the EduVisionPortal component.
// This middleware simply passes all requests through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Only match specific API routes if needed in the future
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
