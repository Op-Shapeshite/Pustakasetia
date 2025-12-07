import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET /api/auth/me - Get current authenticated user
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'Token tidak ditemukan' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Token tidak valid' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role.name,
            status: user.status,
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
    }
}
