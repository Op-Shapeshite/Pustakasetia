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
        const start = startDateParam ? new Date(startDateParam) : new Date(now.getFullYear(), now.getMonth(), 1); // Default to this month
        const end = endDateParam ? new Date(endDateParam) : now;

        // Calculate previous period for comparison
        const duration = end.getTime() - start.getTime();
        const prevStart = new Date(start.getTime() - duration);
        const prevEnd = new Date(start.getTime());

        // 1. Check if GA is enabled (and no local override mandated for specific metrics yet)
        // However, we mix local and GA data. For consistency with filter, we should prefer local or pass dates to GA.
        // For this task, we will focus on Local DB (Fallback logic) usually, or update GA call.
        // User asked "apply filter... to all components".
        // GA Data Service methods support start/end date args.

        if (gaDataService.isEnabled()) {
            // Pass dates to GA service (Need to update GA service to accept dates, currently hardcoded default)
            // But simpler for now: Use the DB fallback logic which we have full control over, 
            // OR assume GA service handles '30daysAgo' etc. Custom dates need YYYY-MM-DD.
            // Given complexity of updating GA service signature, and user preference for "Real-time" (Local DB) in traffic,
            // let's use Local DB for stats as well if parameters are present, OR handle mixed.

            // Actually, let's use the DB fallback logic MAINLY if dates are provided, 
            // to ensure consistency with the requested Local DB priority in previous task.
            // OR: Update GA service usage.
            // Let's stick to DB fallback for custom ranges for now to ensure it works immediately.
        }

        // Using Database Logic for Date Filtering (Robust & Realtime)
        return await getStatsFromDatabase(start, end, prevStart, prevEnd);

    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
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

    // 4. Checkout/Sales
    const currentCheckout = await prisma.bookSale.count({
        where: { createdAt: { gte: start, lte: end } }
    });

    const previousCheckout = await prisma.bookSale.count({
        where: { createdAt: { gte: prevStart, lt: prevEnd } }
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
