import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            try {
                // Fetch from Google Analytics
                const deviceStats = await gaDataService.getDeviceBreakdown();

                console.log('[Devices API] GA Data:', deviceStats);

                const total = deviceStats.mobile + deviceStats.desktop + deviceStats.tablet;
                const mobilePercentage = total > 0 ? (deviceStats.mobile / total) * 100 : 0;

                return NextResponse.json({
                    source: 'google_analytics',
                    mobile: deviceStats.mobile,
                    desktop: deviceStats.desktop,
                    tablet: deviceStats.tablet,
                    mobilePercentage: parseFloat(mobilePercentage.toFixed(1))
                });
            } catch (gaError) {
                console.error('[Devices API] GA Error, falling back to database:', gaError);
                // Fall through to database fallback
            }
        }

        // Fallback to database
        return await getDevicesFromDatabase();

    } catch (error) {
        console.error('Analytics devices error:', error);
        // Fallback to database on error
        try {
            return await getDevicesFromDatabase();
        } catch {
            return NextResponse.json(
                { error: 'Failed to fetch device stats' },
                { status: 500 }
            );
        }
    }
}

// Fallback function to get devices from local database
async function getDevicesFromDatabase() {
    const deviceStats = await prisma.pageView.groupBy({
        by: ['deviceType'],
        _count: { id: true }
    });

    let mobile = 0;
    let desktop = 0;
    let tablet = 0;

    deviceStats.forEach(stat => {
        if (stat.deviceType === 'mobile') mobile = stat._count.id;
        else if (stat.deviceType === 'desktop') desktop = stat._count.id;
        else if (stat.deviceType === 'tablet') tablet = stat._count.id;
    });

    const total = mobile + desktop + tablet;
    const mobilePercentage = total > 0 ? (mobile / total) * 100 : 0;

    return NextResponse.json({
        source: 'database',
        mobile,
        desktop,
        tablet,
        mobilePercentage: parseFloat(mobilePercentage.toFixed(1))
    });
}
