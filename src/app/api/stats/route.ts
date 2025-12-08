import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [totalCategories, totalBooks, soldAggregation] = await Promise.all([
            prisma.category.count(),
            prisma.book.count(),
            prisma.book.aggregate({
                _sum: {
                    sold: true
                }
            })
        ]);

        const totalSold = soldAggregation._sum.sold || 0;

        return NextResponse.json({
            data: {
                totalCategories,
                totalBooks,
                totalSold
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
