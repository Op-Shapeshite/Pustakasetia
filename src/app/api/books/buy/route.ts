import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                sold: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ success: true, sold: updatedBook.sold });
    } catch (error) {
        console.error('Error incrementing sold count:', error);
        return NextResponse.json(
            { error: 'Failed to update sold count' },
            { status: 500 }
        );
    }
}
