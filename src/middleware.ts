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
    '/api/stats', // Allow public read for homepage stats
    '/api/analytics/track', // Allow public POST for tracking page views
    '/api/authors', // Allow public read for author suggestions
    '/api/books/increment-sold', // Allow public POST for incrementing sold count
];

// Routes that allow public GET but require auth for mutations
const publicGetRoutes = [
    '/api/books',
    '/api/categories',
    '/api/analytics', // Allow analytics endpoints for dashboard
];

// Routes that require Admin role (all methods)
const adminOnlyRoutes = [
    '/api/users',
    '/api/roles',
];

// Simple security logging for Edge runtime
function logSecurityEvent(event: string, data: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} | ${event} |`, JSON.stringify(data));
}

function getClientInfo(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIP || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return { ip, userAgent };
}

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

    // Allow public GET for specific routes (including /api/books with any limit)
    if (method === 'GET' && publicGetRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for auth token
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const { ip, userAgent } = getClientInfo(request);
        logSecurityEvent('UNAUTHORIZED_ACCESS', {
            resource: pathname,
            method,
            ip,
            userAgent,
            reason: 'missing_token',
        });
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
        const userId = String(payload.userId);
        const username = String(payload.username);

        // Check admin-only routes (case-insensitive)
        if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
            if (userRole.toLowerCase() !== 'admin') {
                const { ip, userAgent } = getClientInfo(request);
                logSecurityEvent('FORBIDDEN_ACCESS', {
                    resource: pathname,
                    method,
                    userId,
                    username,
                    userRole,
                    ip,
                    userAgent,
                });
                return NextResponse.json(
                    { error: 'Forbidden - Admin access required' },
                    { status: 403 }
                );
            }
        }

        // Add user info to request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', userId);
        requestHeaders.set('x-username', username);
        requestHeaders.set('x-user-role', userRole);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch {
        const { ip, userAgent } = getClientInfo(request);
        logSecurityEvent('TOKEN_INVALID', {
            resource: pathname,
            method,
            ip,
            userAgent,
        });
        return NextResponse.json(
            { error: 'Unauthorized - Token tidak valid' },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: '/api/:path*',
};


