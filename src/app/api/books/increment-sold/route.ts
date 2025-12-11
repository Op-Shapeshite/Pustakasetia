import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/books/increment-sold - Increment sold count for a book
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bookId, quantity = 1 } = body;

        if (!bookId) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        // Validate quantity
        if (typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 });
        }

        // Check if book exists
        const book = await prisma.book.findUnique({
            where: { id: Number(bookId) }
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Increment sold count
        const updatedBook = await prisma.book.update({
            where: { id: Number(bookId) },
            data: {
                sold: { increment: quantity }
            }
        });

        return NextResponse.json({
            success: true,
            bookId: updatedBook.id,
            newSoldCount: updatedBook.sold
        });
    } catch (error) {
        console.error('Error incrementing sold count:', error);
        return NextResponse.json({ error: 'Failed to increment sold count' }, { status: 500 });
    }
}
