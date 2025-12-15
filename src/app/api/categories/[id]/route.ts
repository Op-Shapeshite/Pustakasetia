import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Helper function to check authentication
function checkAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) return null;
    return verifyToken(token);
}

// GET /api/categories/:id - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: { _count: { select: { books: true } } },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

// PUT /api/categories/:id - Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
    // Require authentication for updates
    const user = checkAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE /api/categories/:id - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    // Require authentication for deletion
    const user = checkAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Check if category has books
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: { _count: { select: { books: true } } },
        });

        if (category && category._count.books > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with assigned books' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
