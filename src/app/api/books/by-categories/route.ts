import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/books/by-categories - Get books grouped by category (optimized for mobile)
// Returns all categories with up to 10 books each in a single request
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitPerCategory = parseInt(searchParams.get('limit') || '10');

        // Fetch all categories
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });

        // Fetch books for all categories in parallel
        const booksPromises = categories.map(async (category) => {
            const books = await prisma.book.findMany({
                where: { categoryId: category.id },
                take: limitPerCategory,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            });

            return {
                categoryId: category.id,
                categoryName: category.name,
                books,
            };
        });

        const categoriesWithBooks = await Promise.all(booksPromises);

        // Filter out categories with no books
        const filteredData = categoriesWithBooks.filter(cat => cat.books.length > 0);

        const response = NextResponse.json({
            data: filteredData,
        });

        // Cache for 60 seconds
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

        return response;
    } catch (error) {
        console.error('Error fetching books by categories:', error);
        return NextResponse.json({ error: 'Failed to fetch books by categories' }, { status: 500 });
    }
}
