import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/authors - Get all distinct authors
export async function GET(request: NextRequest) {
    try {
        // Get distinct authors from books
        const authors = await prisma.book.findMany({
            select: {
                author: true,
            },
            distinct: ['author'],
            orderBy: {
                author: 'asc',
            },
        });

        // Extract unique author names
        const authorList = authors
            .map(book => book.author)
            .filter(author => author && author.trim() !== '');

        return NextResponse.json({
            data: authorList,
            total: authorList.length,
        });
    } catch (error) {
        console.error('Error fetching authors:', error);
        return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
    }
}
