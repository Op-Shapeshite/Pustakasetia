import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/users/:id - Get single user
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove password from response
        const { password, ...safeUser } = user;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PUT /api/users/:id - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Check if user is admin and if username is being changed
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { username: true }
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Prevent changing username of admin user
        if (existingUser.username === 'admin' && body.username && body.username !== 'admin') {
            return NextResponse.json({ error: 'Username admin tidak dapat diubah' }, { status: 403 });
        }

        const updateData: Record<string, unknown> = {};

        if (body.username) updateData.username = body.username;
        if (body.fullName) updateData.fullName = body.fullName;
        if (body.roleId) updateData.roleId = parseInt(body.roleId);
        if (body.status) updateData.status = body.status;
        if (body.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(body.password as string)) {
                return NextResponse.json(
                    { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol' },
                    { status: 400 }
                );
            }
            updateData.password = await hashPassword(body.password);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { role: true },
        });

        // Remove password from response
        const { password, ...safeUser } = user;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/:id - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if user is admin before deletion
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { username: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Prevent deletion of admin user
        if (user.username === 'admin') {
            return NextResponse.json({ error: 'User admin tidak dapat dihapus' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
