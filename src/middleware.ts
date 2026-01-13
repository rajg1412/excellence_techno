import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Static files and public images - usually handled by matcher but being safe
    if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!token) {
        if (isPublicRoute) return NextResponse.next();
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const decoded: any = await verifyToken(token);
    if (!decoded) {
        if (isPublicRoute) return NextResponse.next();
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token');
        return response;
    }

    // Role-based protection
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        if (decoded.role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // If user is logged in and trying to access login/register, redirect to profile
    if ((pathname === '/login' || pathname === '/register') && decoded) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
