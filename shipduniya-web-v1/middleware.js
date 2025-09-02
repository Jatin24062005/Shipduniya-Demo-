import { NextResponse } from 'next/server';

export let IsUser=false;
export function middleware(req) {
  const token = req.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if(token){
    IsUser = true;
  }
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/superadmin/:path*', '/support/:path*'], // Protect all routes under /user/ and /admin/
};
