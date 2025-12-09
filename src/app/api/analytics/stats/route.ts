import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

// Helper to get date range for current and previous periods
function getDateRanges(days: number = 30) {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - days);

    const previousStart = new Date(currentStart);
    previousStart.setDate(currentStart.getDate() - days);

    return {
        currentPeriod: { start: currentStart, end: now },
        previousPeriod: { start: previousStart, end: currentStart }
    };
}

export async function GET(request: NextRequest) {
    try {
        const { currentPeriod, previousPeriod } = getDateRanges(30);

        // 1. Total Visitors (unique visitor IDs)
        const currentVisitors = await prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: currentPeriod.start,
                    lte: currentPeriod.end
                }
            },
            select: { visitorId: true },
            distinct: ['visitorId']
        });

        const previousVisitors = await prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: previousPeriod.start,
                    lt: currentPeriod.start
                }
            },
            select: { visitorId: true },
            distinct: ['visitorId']
        });

        const totalVisitors = currentVisitors.length;
        const visitorChange = calculatePercentageChange(
            currentVisitors.length,
            previousVisitors.length
        );

        // 2. Total Books
        const totalBooks = await prisma.book.count();

        // 3. Activity This Month (page views this month)
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const currentActivity = await prisma.pageView.count({
            where: {
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: now
                }
            }
        });

        const previousActivity = await prisma.pageView.count({
            where: {
                createdAt: {
                    gte: firstDayOfLastMonth,
                    lt: firstDayOfMonth
                }
            }
        });

        const activityChange = calculatePercentageChange(currentActivity, previousActivity);

        // 4. Checkout/Sales This Month
        const currentCheckout = await prisma.bookSale.count({
            where: {
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: now
                }
            }
        });

        const previousCheckout = await prisma.bookSale.count({
            where: {
                createdAt: {
                    gte: firstDayOfLastMonth,
                    lt: firstDayOfMonth
                }
            }
        });

        const checkoutChange = calculatePercentageChange(currentCheckout, previousCheckout);

        return NextResponse.json({
            totalVisitors,
            visitorChange: parseFloat(visitorChange.toFixed(2)),
            totalBooks,
            totalActivity: currentActivity,
            activityChange: parseFloat(activityChange.toFixed(2)),
            totalCheckout: currentCheckout,
            checkoutChange: parseFloat(checkoutChange.toFixed(2))
        });

    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics stats' },
            { status: 500 }
        );
    }
}
