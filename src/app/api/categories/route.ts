import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');

        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                skip,
                take: limit,
                include: { _count: { select: { books: true } } },
                orderBy: { name: 'asc' },
            }),
            prisma.category.count(),
        ]);

        return NextResponse.json({
            data: categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST /api/categories - Create a new category
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

        const category = await prisma.category.create({
            data: {
                name,
                description: description || '',
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        if ((error as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
