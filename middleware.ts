import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password'];

// Define role-specific routes
const adminRoutes = ['/admin'];
const teacherRoutes = ['/teacher'];
const learnerRoutes = ['/learner'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;


  // If trying to access auth routes while logged in, redirect to appropriate dashboard
  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else if (role === 'teacher') {
      return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }
  }

  // If trying to access protected routes without token, redirect to login
  if (!publicRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access role-specific routes with wrong role
  if (token && role) {
    // Admin routes are only accessible by admins
    if (pathname.startsWith('/admin') && role !== 'admin') {
      if (role === 'teacher') {
        return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/learner/dashboard', request.url));
      }
    }

    // Teacher routes are only accessible by teachers and admins
    if (pathname.startsWith('/teacher') && role !== 'teacher' && role !== 'admin') {
      return NextResponse.redirect(new URL('/learner/dashboard', request.url));
    }

    // Learner routes are accessible by all roles
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 