import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  NextResponse.redirect(path.toLocaleLowerCase());
  return NextResponse.next();
}
