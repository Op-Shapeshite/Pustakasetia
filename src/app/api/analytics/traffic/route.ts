import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get traffic data grouped by source
        const trafficData = await prisma.trafficSource.groupBy({
            by: ['source'],
            _count: {
                visitorId: true
            },
            _sum: {
                sessions: true
            },
            _avg: {
                bounceRate: true,
                avgDuration: true
            }
        });

        // Format the data
        const formattedData = trafficData.map(item => {
            const avgDurationSeconds = item._avg.avgDuration || 0;
            const minutes = Math.floor(avgDurationSeconds / 60);
            const seconds = avgDurationSeconds % 60;

            return {
                source: item.source.charAt(0).toUpperCase() + item.source.slice(1),
                users: item._count.visitorId,
                sessions: item._sum.sessions || 0,
                bounceRate: item._avg.bounceRate?.toFixed(1) || '0.0',
                avgDuration: `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            };
        });

        return NextResponse.json({ data: formattedData });

    } catch (error) {
        console.error('Analytics traffic error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch traffic data' },
            { status: 500 }
        );
    }
}
