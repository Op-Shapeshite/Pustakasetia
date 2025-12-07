import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/books/:id - Get single book
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
            include: { category: true },
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
    }
}

// PUT /api/books/:id - Update book
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.author && { author: body.author }),
                ...(body.pages !== undefined && { pages: parseInt(body.pages) }),
                ...(body.size && { size: body.size }),
                ...(body.isbn && { isbn: body.isbn }),
                ...(body.price !== undefined && { price: parseFloat(body.price) }),
                ...(body.edition && { edition: body.edition }),
                ...(body.synopsis !== undefined && { synopsis: body.synopsis }),
                ...(body.image && { image: body.image }),
                ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
                ...(body.categoryId && { categoryId: parseInt(body.categoryId) }),
            },
            include: { category: true },
        });

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}

// DELETE /api/books/:id - Delete book
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await prisma.book.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}
