import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/roles/:id - Get single role
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
            include: { _count: { select: { users: true } } },
        });

        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
    }
}

// PUT /api/roles/:id - Update role
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const role = await prisma.role.update({
            where: { id: parseInt(id) },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
            },
        });

        return NextResponse.json(role);
    } catch (error) {
        console.error('Error updating role:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

// DELETE /api/roles/:id - Delete role
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if role has users
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
            include: { _count: { select: { users: true } } },
        });

        if (role && role._count.users > 0) {
            return NextResponse.json(
                { error: 'Cannot delete role with assigned users' },
                { status: 400 }
            );
        }

        await prisma.role.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}
