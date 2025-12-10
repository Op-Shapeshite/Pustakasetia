import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            // Fetch from Google Analytics
            const gaStats = await gaDataService.getDashboardStats();

            // Get total books from database (this is local data)
            const totalBooks = await prisma.book.count();

            // Get checkout/sales from database (this is local data)
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

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

            const checkoutChange = previousCheckout === 0
                ? (currentCheckout > 0 ? 100 : 0)
                : ((currentCheckout - previousCheckout) / previousCheckout) * 100;

            return NextResponse.json({
                source: 'google_analytics',
                totalVisitors: gaStats.visitors.current,
                visitorChange: gaStats.visitors.change,
                totalBooks,
                totalActivity: gaStats.pageViews.current,
                activityChange: gaStats.pageViews.change,
                totalCheckout: currentCheckout,
                checkoutChange: parseFloat(checkoutChange.toFixed(2))
            });
        }

        // Fallback to database if GA is not configured
        return await getStatsFromDatabase();

    } catch (error) {
        console.error('Analytics stats error:', error);
        // Fallback to database on error
        try {
            return await getStatsFromDatabase();
        } catch {
            return NextResponse.json(
                { error: 'Failed to fetch analytics stats' },
                { status: 500 }
            );
        }
    }
}

// Fallback function to get stats from local database
async function getStatsFromDatabase() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Total Visitors
    const currentVisitors = await prisma.pageView.findMany({
        where: { createdAt: { gte: thirtyDaysAgo, lte: now } },
        select: { visitorId: true },
        distinct: ['visitorId']
    });

    const previousVisitors = await prisma.pageView.findMany({
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        select: { visitorId: true },
        distinct: ['visitorId']
    });

    const visitorChange = previousVisitors.length === 0
        ? (currentVisitors.length > 0 ? 100 : 0)
        : ((currentVisitors.length - previousVisitors.length) / previousVisitors.length) * 100;

    // 2. Total Books
    const totalBooks = await prisma.book.count();

    // 3. Activity This Month
    const currentActivity = await prisma.pageView.count({
        where: { createdAt: { gte: firstDayOfMonth, lte: now } }
    });

    const previousActivity = await prisma.pageView.count({
        where: { createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfMonth } }
    });

    const activityChange = previousActivity === 0
        ? (currentActivity > 0 ? 100 : 0)
        : ((currentActivity - previousActivity) / previousActivity) * 100;

    // 4. Checkout/Sales
    const currentCheckout = await prisma.bookSale.count({
        where: { createdAt: { gte: firstDayOfMonth, lte: now } }
    });

    const previousCheckout = await prisma.bookSale.count({
        where: { createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfMonth } }
    });

    const checkoutChange = previousCheckout === 0
        ? (currentCheckout > 0 ? 100 : 0)
        : ((currentCheckout - previousCheckout) / previousCheckout) * 100;

    return NextResponse.json({
        source: 'database',
        totalVisitors: currentVisitors.length,
        visitorChange: parseFloat(visitorChange.toFixed(2)),
        totalBooks,
        totalActivity: currentActivity,
        activityChange: parseFloat(activityChange.toFixed(2)),
        totalCheckout: currentCheckout,
        checkoutChange: parseFloat(checkoutChange.toFixed(2))
    });
}
