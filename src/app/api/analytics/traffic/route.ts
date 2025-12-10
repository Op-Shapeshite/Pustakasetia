import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { gaDataService } from '@/lib/google-analytics-data';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Prioritize local database for real-time accuracy and custom UTM handling
        // Google Analytics API has 24-48h latency which confuses users testing locally
        return await getTrafficFromDatabase();

        /* 
        // Legacy: GA Data API fallback (COMMENTED OUT TO FORCE LOCAL DB USAGE)
        // Check if Google Analytics Data API is enabled
        if (gaDataService.isEnabled()) {
            // ... (original GA logic kept for reference if needed later)
        }
        */

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
