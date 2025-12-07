import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
    try {
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
            return NextResponse.json(
                { error: 'Username atau password salah' },
                { status: 401 }
            );
        }

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
