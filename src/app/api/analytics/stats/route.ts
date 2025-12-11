import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Helper to get date filter
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        const now = new Date();
        const start = startDateParam ? new Date(startDateParam) : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDateParam ? new Date(endDateParam) : now;

        // Calculate previous period for comparison
        // For single day: compare with previous day
        // For date range: compare with equal-length period immediately before
        const actualDuration = end.getTime() - start.getTime();
        const isSingleDay = actualDuration < 24 * 60 * 60 * 1000; // less than 1 day

        let prevStart: Date;
        let prevEnd: Date;

        if (isSingleDay) {
            // Single day selected: compare with previous day
            prevStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
            prevEnd = new Date(prevStart); // same day
        } else {
            // Date range: compare with equal-length period before
            prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000); // day before current start
            prevStart = new Date(prevEnd.getTime() - actualDuration);
        }

        // Format dates to YYYY-MM-DD for Google Analytics API
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            try {
                const gaStartDate = formatDate(start);
                const gaEndDate = formatDate(end);
                const gaPrevStartDate = formatDate(prevStart);
                const gaPrevEndDate = formatDate(prevEnd);

                console.log(`[Stats API] Fetching GA data for ${gaStartDate} to ${gaEndDate}`);

                // Fetch current and previous period data from Google Analytics
                const [currentVisitors, currentPageViews, previousVisitors, previousPageViews] = await Promise.all([
                    gaDataService.getVisitors(gaStartDate, gaEndDate),
                    gaDataService.getPageViews(gaStartDate, gaEndDate),
                    gaDataService.getVisitors(gaPrevStartDate, gaPrevEndDate),
                    gaDataService.getPageViews(gaPrevStartDate, gaPrevEndDate),
                ]);

                console.log(`[Stats API] Current period: ${gaStartDate} to ${gaEndDate}`);
                console.log(`[Stats API] Previous period: ${gaPrevStartDate} to ${gaPrevEndDate}`);
                console.log(`[Stats API] Current Visitors: ${currentVisitors}, Previous Visitors: ${previousVisitors}`);
                console.log(`[Stats API] Current PageViews: ${currentPageViews}, Previous PageViews: ${previousPageViews}`);

                // Calculate percentage changes
                const visitorChange = previousVisitors === 0
                    ? (currentVisitors > 0 ? 100 : 0)
                    : ((currentVisitors - previousVisitors) / previousVisitors) * 100;

                const activityChange = previousPageViews === 0
                    ? (currentPageViews > 0 ? 100 : 0)
                    : ((currentPageViews - previousPageViews) / previousPageViews) * 100;

                console.log(`[Stats API] Calculated visitorChange: ${visitorChange}, activityChange: ${activityChange}`);

                // Books and Checkout still come from database (internal app data)
                const totalBooks = await prisma.book.count();

                // Checkout is now based on SUM of sold column (cumulative total)
                const soldAggregate = await prisma.book.aggregate({
                    _sum: { sold: true }
                });
                const totalSold = soldAggregate._sum.sold || 0;

                console.log(`[Stats API] GA Data - Visitors: ${currentVisitors}, PageViews: ${currentPageViews}`);

                // checkoutChange: since sold is cumulative, treat previous as 0
                // If there are sales, change is 100%, otherwise 0%
                const checkoutChange = totalSold > 0 ? 100 : 0;

                return NextResponse.json({
                    source: 'google_analytics',
                    totalVisitors: currentVisitors,
                    visitorChange: parseFloat(visitorChange.toFixed(2)),
                    totalBooks,
                    totalActivity: currentPageViews,
                    activityChange: parseFloat(activityChange.toFixed(2)),
                    totalCheckout: totalSold,
                    checkoutChange
                });

            } catch (gaError) {
                console.error('[Stats API] GA Error, falling back to database:', gaError);
                // Continue to database fallback
            }
        }

        // Fallback to database
        return await getStatsFromDatabase(start, end, prevStart, prevEnd);

    } catch (error) {
        console.error('Analytics stats error:', error);
        // Fallback to database on error
        try {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const duration = now.getTime() - start.getTime();
            const prevStart = new Date(start.getTime() - duration);
            const prevEnd = new Date(start.getTime());
            return await getStatsFromDatabase(start, now, prevStart, prevEnd);
        } catch {
            return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
        }
    }
}

// Fallback function to get stats from local database
async function getStatsFromDatabase(start: Date, end: Date, prevStart: Date, prevEnd: Date) {
    // 1. Total Visitors (Unique Visitor IDs in range)
    const currentVisitors = await prisma.pageView.findMany({
        where: { createdAt: { gte: start, lte: end } },
        select: { visitorId: true },
        distinct: ['visitorId']
    });

    const previousVisitors = await prisma.pageView.findMany({
        where: { createdAt: { gte: prevStart, lt: prevEnd } },
        select: { visitorId: true },
        distinct: ['visitorId']
    });

    const visitorChange = previousVisitors.length === 0
        ? (currentVisitors.length > 0 ? 100 : 0)
        : ((currentVisitors.length - previousVisitors.length) / previousVisitors.length) * 100;

    // 2. Total Books (Snapshot - Filtering by creation date implies "Books Added")
    // If filter is active, maybe show Books Added? Or Total Books existing?
    // Dashboard says "Total Buku". Usually implies stock. Date filter usually doesn't apply to "Total Inventory".
    // But "Total Buku yang telah di upload" implies history.
    // Let's filter by createdAt to show "Books Added in Period" if filter is active, OR just return Total.
    // Dashboard labels it "Total Buku". If I select "Yesterday", seeing "2 books" (added) is useful. 
    // If I see "Total Inventory", the date filter is ignored. 
    // Let's filter by createdAt to match "Activities".
    const totalBooks = await prisma.book.count({
        where: { createdAt: { lte: end } } // Books existing at end of period? or Added in period?
        // "Total Buku" usually means Current Inventory.
        // However, "Activity" implies flow.
        // Let's keep Total Books as ALL books (ignoring start date, adhering to 'at this time' or just global)
        // Actually, let's use GLOBAL total for now to allow "Inventory Check".
    });

    // 3. Activity (Page Views)
    const currentActivity = await prisma.pageView.count({
        where: { createdAt: { gte: start, lte: end } }
    });

    const previousActivity = await prisma.pageView.count({
        where: { createdAt: { gte: prevStart, lt: prevEnd } }
    });

    const activityChange = previousActivity === 0
        ? (currentActivity > 0 ? 100 : 0)
        : ((currentActivity - previousActivity) / previousActivity) * 100;

    // 4. Checkout/Sales - now based on SUM of sold column (cumulative)
    const soldAggregate = await prisma.book.aggregate({
        _sum: { sold: true }
    });
    const totalSold = soldAggregate._sum.sold || 0;

    // checkoutChange: since sold is cumulative, treat previous as 0
    // If there are sales, change is 100%, otherwise 0%
    const checkoutChange = totalSold > 0 ? 100 : 0;

    return NextResponse.json({
        source: 'database',
        totalVisitors: currentVisitors.length,
        visitorChange: parseFloat(visitorChange.toFixed(2)),
        totalBooks,
        totalActivity: currentActivity,
        activityChange: parseFloat(activityChange.toFixed(2)),
        totalCheckout: totalSold,
        checkoutChange
    });
}
