/**
 * Security Logger Utility
 * Logs security-related events for audit trails and monitoring
 */

export type SecurityEventType =
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGIN_BLOCKED'
    | 'LOGOUT'
    | 'TOKEN_EXPIRED'
    | 'UNAUTHORIZED_ACCESS'
    | 'FORBIDDEN_ACCESS'
    | 'USER_CREATED'
    | 'USER_UPDATED'
    | 'USER_DELETED'
    | 'ROLE_CREATED'
    | 'ROLE_UPDATED'
    | 'ROLE_DELETED'
    | 'BOOK_CREATED'
    | 'BOOK_UPDATED'
    | 'BOOK_DELETED'
    | 'PASSWORD_CHANGED'
    | 'RATE_LIMIT_EXCEEDED';

interface SecurityLogEntry {
    timestamp: string;
    event: SecurityEventType;
    userId?: number | string;
    username?: string;
    ip?: string;
    userAgent?: string;
    resource?: string;
    details?: Record<string, unknown>;
}

// In-memory log storage (use external service in production)
const securityLogs: SecurityLogEntry[] = [];
const MAX_LOGS = 10000; // Keep last 10k logs in memory

/**
 * Log a security event
 */
export function logSecurityEvent(
    event: SecurityEventType,
    data: Omit<SecurityLogEntry, 'timestamp' | 'event'>
): void {
    const entry: SecurityLogEntry = {
        timestamp: new Date().toISOString(),
        event,
        ...data,
    };

    // Add to in-memory storage
    securityLogs.push(entry);

    // Trim old logs
    if (securityLogs.length > MAX_LOGS) {
        securityLogs.shift();
    }

    // Console output for development
    const logLevel = getLogLevel(event);
    const message = formatLogMessage(entry);

    switch (logLevel) {
        case 'error':
            console.error(`[SECURITY] ${message}`);
            break;
        case 'warn':
            console.warn(`[SECURITY] ${message}`);
            break;
        default:
            console.log(`[SECURITY] ${message}`);
    }

    // TODO: In production, send to external logging service
    // Examples: Datadog, Sentry, AWS CloudWatch, ELK Stack
    // await sendToExternalService(entry);
}

function getLogLevel(event: SecurityEventType): 'error' | 'warn' | 'info' {
    const errorEvents: SecurityEventType[] = [
        'UNAUTHORIZED_ACCESS',
        'FORBIDDEN_ACCESS',
        'RATE_LIMIT_EXCEEDED',
    ];
    const warnEvents: SecurityEventType[] = [
        'LOGIN_FAILED',
        'LOGIN_BLOCKED',
        'TOKEN_EXPIRED',
    ];

    if (errorEvents.includes(event)) return 'error';
    if (warnEvents.includes(event)) return 'warn';
    return 'info';
}

function formatLogMessage(entry: SecurityLogEntry): string {
    const parts = [
        entry.event,
        entry.username ? `user=${entry.username}` : null,
        entry.userId ? `userId=${entry.userId}` : null,
        entry.ip ? `ip=${entry.ip}` : null,
        entry.resource ? `resource=${entry.resource}` : null,
    ].filter(Boolean);

    return parts.join(' | ');
}

/**
 * Get recent security logs (for admin dashboard)
 */
export function getSecurityLogs(limit = 100): SecurityLogEntry[] {
    return securityLogs.slice(-limit).reverse();
}

/**
 * Get logs by event type
 */
export function getLogsByEventType(event: SecurityEventType, limit = 100): SecurityLogEntry[] {
    return securityLogs
        .filter(log => log.event === event)
        .slice(-limit)
        .reverse();
}

/**
 * Get logs by user
 */
export function getLogsByUser(userId: number | string, limit = 100): SecurityLogEntry[] {
    return securityLogs
        .filter(log => log.userId === userId)
        .slice(-limit)
        .reverse();
}

/**
 * Get failed login attempts in last N minutes
 */
export function getRecentFailedLogins(minutes = 15): SecurityLogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    return securityLogs.filter(
        log => log.event === 'LOGIN_FAILED' && log.timestamp > cutoff
    );
}

/**
 * Helper to extract request info for logging
 */
export function extractRequestInfo(request: Request): {
    ip: string;
    userAgent: string;
} {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIP || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    return { ip, userAgent };
}
