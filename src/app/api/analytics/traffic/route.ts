import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            // Fetch from Google Analytics
            const trafficSources = await gaDataService.getTrafficSources();

            // Format the data
            const formattedData = trafficSources.map(item => {
                const avgDurationSeconds = Math.floor(item.avgDuration);
                const minutes = Math.floor(avgDurationSeconds / 60);
                const seconds = avgDurationSeconds % 60;

                return {
                    source: item.source.charAt(0).toUpperCase() + item.source.slice(1),
                    users: item.sessions,
                    sessions: item.sessions,
                    bounceRate: item.bounceRate.toFixed(1),
                    avgDuration: `00:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`
                };
            });

            return NextResponse.json({
                source: 'google_analytics',
                data: formattedData
            });
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
