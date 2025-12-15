/**
 * Input Sanitization Utilities
 * Provides protection against SQL injection and other input attacks
 */

// Common SQL injection patterns to detect
const SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|FROM|WHERE)\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g, // SQL comments and statement terminator
    /(\'|\")/g, // Quote characters
    /(\bOR\b|\bAND\b)\s*[\'\"]?\d+[\'\"]?\s*=\s*[\'\"]?\d+/gi, // OR/AND 1=1 patterns
    /(\bOR\b|\bAND\b)\s*[\'\"]?[a-zA-Z]+[\'\"]?\s*=\s*[\'\"]?[a-zA-Z]+/gi, // OR/AND 'a'='a' patterns
];

// XSS attack patterns
const XSS_PATTERNS = [
    /<script\b[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick=, onerror=, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
];

/**
 * Check if a string contains potential SQL injection
 */
export function containsSQLInjection(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check if a string contains potential XSS attack
 */
export function containsXSS(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    
    return XSS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize a string by removing dangerous characters
 * Use this for text fields that should be plain text
 */
export function sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Sanitize search query - allows basic alphanumeric and common chars
 */
export function sanitizeSearchQuery(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Only allow alphanumeric, spaces, and common punctuation
    return input
        .replace(/[^\w\s\-.,]/g, '')
        .trim()
        .slice(0, 100); // Limit length
}

/**
 * Validate and sanitize an ID parameter
 * Returns null if invalid
 */
export function sanitizeId(input: string | number): number | null {
    const parsed = typeof input === 'number' ? input : parseInt(input, 10);
    
    if (isNaN(parsed) || parsed < 1 || parsed > Number.MAX_SAFE_INTEGER) {
        return null;
    }
    
    return parsed;
}

/**
 * Sanitize an object's string values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized as T;
}

/**
 * Validate input doesn't contain malicious content
 * Returns error message if invalid, null if valid
 */
export function validateInput(input: string, fieldName: string = 'Input'): string | null {
    if (containsSQLInjection(input)) {
        console.warn(`SQL Injection attempt detected in ${fieldName}:`, input.slice(0, 50));
        return `${fieldName} contains invalid characters`;
    }
    
    if (containsXSS(input)) {
        console.warn(`XSS attempt detected in ${fieldName}:`, input.slice(0, 50));
        return `${fieldName} contains invalid content`;
    }
    
    return null;
}
