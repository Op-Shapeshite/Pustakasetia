import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            try {
                // Get start and end dates from URL params
                const url = new URL(request.url);
                const startDate = url.searchParams.get('startDate');
                const endDate = url.searchParams.get('endDate');

                // Format dates to YYYY-MM-DD
                const formatDate = (dateValue: string) => {
                    return new Date(dateValue).toISOString().split('T')[0];
                };

                const gaStartDate = startDate ? formatDate(startDate) : '30daysAgo';
                const gaEndDate = endDate ? formatDate(endDate) : 'today';

                console.log(`[Traffic API] Fetching GA data for ${gaStartDate} to ${gaEndDate}`);

                const analyticsData = await gaDataService.getTrafficSources(
                    gaStartDate,
                    gaEndDate
                );

                // If we get valid data, format and use it
                if (analyticsData && analyticsData.length > 0) {
                    console.log(`[Traffic API] GA Data:`, analyticsData.length, 'rows');

                    const formattedGAData = analyticsData.map(item => {
                        const avgDurationSeconds = item.avgDuration || 0;
                        const minutes = Math.floor(avgDurationSeconds / 60);
                        const seconds = Math.floor(avgDurationSeconds % 60);

                        return {
                            source: item.source.charAt(0).toUpperCase() + item.source.slice(1),
                            users: item.sessions, // GA returns sessions mostly, mapping to users column
                            sessions: item.sessions,
                            bounceRate: item.bounceRate.toFixed(1),
                            avgDuration: `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                        };
                    });

                    return NextResponse.json({
                        source: 'google_analytics',
                        data: formattedGAData
                    });
                } else {
                    console.log('[Traffic API] GA returned empty data, falling back to database');
                }
            } catch (error) {
                console.error('[Traffic API] GA Error:', error);
                // Continue to DB fallback if GA fails
            }
        }

        // Fallback to database
        return await getTrafficFromDatabase();

    } catch (error) {
        console.error('Analytics traffic error:', error);
        // Fallback to database on error
        try {
            return await getTrafficFromDatabase();
        } catch {
            return NextResponse.json(
                { error: 'Failed to fetch traffic data' },
                { status: 500 }
            );
        }
    }
}

// Fallback function to get traffic from local database
async function getTrafficFromDatabase() {
    const trafficData = await prisma.trafficSource.groupBy({
        by: ['source'],
        _count: { visitorId: true },
        _sum: { sessions: true },
        _avg: { bounceRate: true, avgDuration: true }
    });

    const formattedData = trafficData.map(item => {
        const avgDurationSeconds = item._avg.avgDuration || 0;
        const minutes = Math.floor(avgDurationSeconds / 60);
        const seconds = avgDurationSeconds % 60;

        return {
            source: item.source.charAt(0).toUpperCase() + item.source.slice(1),
            users: item._count.visitorId,
            sessions: item._sum.sessions || 0,
            bounceRate: item._avg.bounceRate?.toFixed(1) || '0.0',
            avgDuration: `00:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`
        };
    });

    return NextResponse.json({
        source: 'database',
        data: formattedData
    });
}
