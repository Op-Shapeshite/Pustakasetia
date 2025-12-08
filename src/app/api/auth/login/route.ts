import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

// Simple in-memory rate limiting (use Redis for production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0] || realIP || 'unknown';
}

function checkRateLimit(ip: string): { blocked: boolean; remainingTime?: number } {
    const attempt = loginAttempts.get(ip);
    if (!attempt) return { blocked: false };

    const timeSinceLastAttempt = Date.now() - attempt.lastAttempt;

    // Reset after lockout duration
    if (timeSinceLastAttempt > LOCKOUT_DURATION) {
        loginAttempts.delete(ip);
        return { blocked: false };
    }

    if (attempt.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return { blocked: true, remainingTime };
    }

    return { blocked: false };
}

function recordFailedAttempt(ip: string): void {
    const attempt = loginAttempts.get(ip);
    if (attempt) {
        attempt.count += 1;
        attempt.lastAttempt = Date.now();
    } else {
        loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
    }
}

function clearAttempts(ip: string): void {
    loginAttempts.delete(ip);
}

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);

        // Check rate limit
        const rateLimit = checkRateLimit(clientIP);
        if (rateLimit.blocked) {
            return NextResponse.json(
                { error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.remainingTime} menit.` },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username dan password diperlukan' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { username },
            include: { role: true },
        });

        if (!user) {
            recordFailedAttempt(clientIP);
            return NextResponse.json(
                { error: 'Username atau password salah' },
                { status: 401 }
            );
        }

        if (user.status !== 'active') {
            return NextResponse.json(
                { error: 'Akun tidak aktif' },
                { status: 401 }
            );
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            recordFailedAttempt(clientIP);
            return NextResponse.json(
                { error: 'Username atau password salah' },
                { status: 401 }
            );
        }

        // Successful login - clear attempts
        clearAttempts(clientIP);

        const token = generateToken({
            userId: user.id,
            username: user.username,
            role: user.role.name,
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                role: user.role.name,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'Login gagal' }, { status: 500 });
    }
}

