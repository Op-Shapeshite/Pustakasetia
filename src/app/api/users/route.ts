import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// GET /api/users - Get all users with pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { username: { contains: search } },
                { fullName: { contains: search } },
            ],
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                include: { role: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        // Remove password from response
        const safeUsers = users.map(({ password, ...user }) => user);

        return NextResponse.json({
            data: safeUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { username, fullName, password, roleId, status } = body;

        if (!username || !fullName || !password || !roleId) {
            return NextResponse.json(
                { error: 'Missing required fields: username, fullName, password, roleId' },
                { status: 400 }
            );
        }

        // Password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                username,
                fullName,
                password: hashedPassword,
                roleId: parseInt(roleId),
                status: status || 'active',
            },
            include: { role: true },
        });

        // Remove password from response
        const { password: _, ...safeUser } = user;

        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        if ((error as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
