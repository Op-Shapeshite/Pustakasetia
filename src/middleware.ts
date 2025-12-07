import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// Public routes that don't require authentication
const publicRoutes = [
    '/api/auth/login',
    '/api/categories', // Allow public read for categories (for forms)
];

// Routes that allow public GET but require auth for mutations
const publicGetRoutes = [
    '/api/books',
    '/api/categories',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;

    // Skip non-API routes
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow public GET for specific routes
    if (method === 'GET' && publicGetRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for auth token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized - Token diperlukan' },
            { status: 401 }
        );
    }

    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            { error: 'Unauthorized - Token tidak valid' },
            { status: 401 }
        );
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-username', payload.username);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: '/api/:path*',
};
