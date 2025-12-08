import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT_SECRET must be set in environment variables
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set. Using fallback for development only.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-production';
const SALT_ROUNDS = 10;

export interface JWTPayload {
    userId: number;
    username: string;
    role: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }); // Reduced from 7d for security
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.slice(7);
}
