import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// JWT_SECRET must be set in environment variables
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set in middleware. Using fallback for development only.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-production';

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

// Routes that require Admin role (all methods)
const adminOnlyRoutes = [
    '/api/users',
    '/api/roles',
];

export async function middleware(request: NextRequest) {
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

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Unauthorized - Token diperlukan' },
            { status: 401 }
        );
    }

    const token = authHeader.slice(7);

    try {
        // Verify token using jose (Edge-compatible)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userRole = String(payload.role);

        // Check admin-only routes
        if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
            if (userRole !== 'Admin') {
                return NextResponse.json(
                    { error: 'Forbidden - Admin access required' },
                    { status: 403 }
                );
            }
        }

        // Add user info to request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', String(payload.userId));
        requestHeaders.set('x-username', String(payload.username));
        requestHeaders.set('x-user-role', userRole);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Unauthorized - Token tidak valid' },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: '/api/:path*',
};

