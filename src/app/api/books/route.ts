import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/books - Get all books with pagination, search, and filter
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const categoryId = searchParams.get('categoryId');

        const skip = (page - 1) * limit;

        const where = {
            AND: [
                search ? {
                    OR: [
                        { title: { contains: search } },
                        { author: { contains: search } },
                        { isbn: { contains: search } },
                    ],
                } : {},
                categoryId ? { categoryId: parseInt(categoryId) } : {},
            ],
        };

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: limit,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.book.count({ where }),
        ]);

        // Add cache headers for performance
        const response = NextResponse.json({
            data: books,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

        // Cache for 60 seconds, stale-while-revalidate for 300 seconds
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

        return response;
    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
    }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { title, author, pages, size, isbn, price, edition, paper_type, synopsis, image, stock, categoryId } = body;

        if (!title || !author || !isbn || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields: title, author, isbn, categoryId' },
                { status: 400 }
            );
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                pages: parseInt(pages) || 0,
                size: size || '',
                isbn,
                price: parseFloat(price) || 0,
                edition: edition || '',
                paper_type: paper_type || 'HVS',
                synopsis: synopsis || '',
                image: image || '/img/book-cover-optimized.png',
                stock: parseInt(stock) || 0,
                categoryId: parseInt(categoryId),
            },
            include: { category: true },
        });

        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);
        if ((error as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'ISBN already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
    }
}
