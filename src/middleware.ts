import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// JWT_SECRET must be set in environment variables
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set in middleware. Using fallback for development only.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-production';

// ============== SECURITY CONSTANTS ==============
// Maximum request body size (10MB)
const MAX_BODY_SIZE = 10 * 1024 * 1024;

// SQL Injection detection patterns (for logging/monitoring, not blocking - Prisma handles actual protection)
const SQL_INJECTION_PATTERNS = [
    /('\s*(OR|AND)\s*'\d*'\s*=\s*'\d*)/gi,
    /(;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE))/gi,
    /(UNION\s+(ALL\s+)?SELECT)/gi,
    /(-{2}|#|\/*\*)/g, // SQL comments
];

// Check if input contains potential SQL injection patterns (for logging purposes)
function containsSuspiciousInput(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

// ============== RATE LIMITING (THROTTLE MODE) ==============
// In-memory rate limiter with throttling (use Redis for production with multiple instances)
// Instead of rejecting, requests will be delayed/queued
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastRequest: number }>();

// Rate limit configuration - Optimized for VPS (2 CPU, 4GB RAM, 50GB Disk)
const RATE_LIMIT_CONFIG = {
    // Public read endpoints (books, categories, stats) - High limits for catalog browsing
    public: { requests: 500, windowMs: 60 * 1000, minDelayMs: 20 }, // 500 req/min, min 20ms delay
    // General API rate limit
    default: { requests: 300, windowMs: 60 * 1000, minDelayMs: 50 }, // 300 req/min, min 50ms delay
    // Analytics endpoints - moderate limits
    analytics: { requests: 120, windowMs: 60 * 1000, minDelayMs: 100 }, // 120 req/min
    // Stricter limits for sensitive endpoints
    auth: { requests: 15, windowMs: 60 * 1000, minDelayMs: 500 }, // 15 req/min (security)
    upload: { requests: 30, windowMs: 60 * 1000, minDelayMs: 300 }, // 30 req/min
};

// Max delay to prevent connection timeout (Edge Runtime has limits)
const MAX_DELAY_MS = 10000; // 10 seconds max wait

function getRateLimitConfig(pathname: string) {
    // Auth endpoints - strict security
    if (pathname.startsWith('/api/auth')) {
        return RATE_LIMIT_CONFIG.auth;
    }
    // Upload endpoints
    if (pathname.startsWith('/api/upload')) {
        return RATE_LIMIT_CONFIG.upload;
    }
    // Analytics endpoints
    if (pathname.startsWith('/api/analytics')) {
        return RATE_LIMIT_CONFIG.analytics;
    }
    // Public read endpoints - highest limits for browsing
    if (pathname.startsWith('/api/books') ||
        pathname.startsWith('/api/categories') ||
        pathname.startsWith('/api/stats') ||
        pathname.startsWith('/api/authors')) {
        return RATE_LIMIT_CONFIG.public;
    }
    return RATE_LIMIT_CONFIG.default;
}

// Check if IP is localhost/local
function isLocalhost(ip: string): boolean {
    const localIPs = [
        'localhost',
        '127.0.0.1',
        '::1',
        '::ffff:127.0.0.1',
        '0.0.0.0',
        '',
        'unknown',
    ];
    return localIPs.includes(ip) || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
}

// Sleep function for Edge Runtime
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function throttleRequest(ip: string, pathname: string): Promise<{ delayed: boolean; delayMs: number; record?: { count: number; resetTime: number } }> {
    // Skip throttling for localhost/local development
    if (isLocalhost(ip)) {
        return { delayed: false, delayMs: 0 };
    }

    const config = getRateLimitConfig(pathname);
    const key = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`; // Group by /api/endpoint
    const now = Date.now();

    const record = rateLimitMap.get(key);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
        for (const [k, v] of rateLimitMap.entries()) {
            if (v.resetTime < now) rateLimitMap.delete(k);
        }
    }

    if (!record || record.resetTime < now) {
        // New window - no delay needed
        rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs, lastRequest: now });
        return { delayed: false, delayMs: 0 };
    }

    // Calculate delay based on request rate
    const timeSinceLastRequest = now - record.lastRequest;
    const idealInterval = config.windowMs / config.requests; // Ideal time between requests

    let delayMs = 0;

    if (record.count >= config.requests) {
        // Over limit - calculate delay until reset or use minimum delay
        delayMs = Math.min(record.resetTime - now, MAX_DELAY_MS);
    } else if (timeSinceLastRequest < config.minDelayMs) {
        // Too fast - apply minimum delay
        delayMs = config.minDelayMs - timeSinceLastRequest;
    } else if (timeSinceLastRequest < idealInterval) {
        // Slightly fast - apply small delay to smooth traffic
        delayMs = Math.min(idealInterval - timeSinceLastRequest, config.minDelayMs);
    }

    // Cap delay to prevent timeout
    delayMs = Math.min(delayMs, MAX_DELAY_MS);

    if (delayMs > 0) {
        await sleep(delayMs);
    }

    // Update record after delay
    record.count++;
    record.lastRequest = Date.now();

    return { delayed: delayMs > 0, delayMs, record };
}

// Add rate limit headers to response
function addRateLimitHeaders(response: NextResponse, pathname: string, record: { count: number; resetTime: number } | undefined): NextResponse {
    const config = getRateLimitConfig(pathname);
    const remaining = record ? Math.max(0, config.requests - record.count) : config.requests;
    const reset = record ? Math.ceil((record.resetTime - Date.now()) / 1000) : Math.ceil(config.windowMs / 1000);

    response.headers.set('X-RateLimit-Limit', String(config.requests));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));

    return response;
}

// ============== END RATE LIMITING ==============

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
    const { ip, userAgent } = getClientInfo(request);

    // Skip non-API routes
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // ============== REQUEST SIZE LIMIT CHECK ==============
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        logSecurityEvent('OVERSIZED_REQUEST', {
            resource: pathname,
            method,
            ip,
            userAgent,
            contentLength,
        });
        return NextResponse.json(
            { error: 'Request body too large' },
            { status: 413 }
        );
    }

    // ============== SUSPICIOUS INPUT DETECTION ==============
    // Log suspicious patterns in URL (Prisma ORM protects against actual SQL injection)
    const searchParams = request.nextUrl.searchParams;
    for (const [key, value] of searchParams.entries()) {
        if (containsSuspiciousInput(value)) {
            logSecurityEvent('SUSPICIOUS_INPUT_DETECTED', {
                resource: pathname,
                method,
                ip,
                userAgent,
                parameter: key,
                // Don't log actual value to avoid log injection
            });
            // Note: We don't block because Prisma ORM handles parameterized queries
            // This is just for monitoring/alerting purposes
        }
    }

    // ============== THROTTLE CHECK ==============
    const throttleResult = await throttleRequest(ip, pathname);

    if (throttleResult.delayed) {
        logSecurityEvent('REQUEST_THROTTLED', {
            resource: pathname,
            method,
            ip,
            userAgent,
            delayMs: throttleResult.delayMs,
        });
    }
    // ============== END THROTTLE CHECK ==============

    // Allow public routes with rate limit headers
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        const response = NextResponse.next();
        return addRateLimitHeaders(response, pathname, throttleResult.record);
    }

    // Allow public GET for specific routes (including /api/books with any limit)
    if (method === 'GET' && publicGetRoutes.some(route => pathname.startsWith(route))) {
        const response = NextResponse.next();
        return addRateLimitHeaders(response, pathname, throttleResult.record);
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

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        return addRateLimitHeaders(response, pathname, throttleResult.record);
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


