import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const skip = (page - 1) * limit;

        const [roles, total] = await Promise.all([
            prisma.role.findMany({
                skip,
                take: limit,
                include: { _count: { select: { users: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.role.count(),
        ]);

        return NextResponse.json({
            data: roles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

// POST /api/roles - Create a new role
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Missing required field: name' },
                { status: 400 }
            );
        }

        const role = await prisma.role.create({
            data: {
                name,
                description: description || '',
            },
        });

        return NextResponse.json(role, { status: 201 });
    } catch (error) {
        console.error('Error creating role:', error);
        if ((error as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'Role name already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}
