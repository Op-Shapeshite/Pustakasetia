import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get device statistics
        const deviceStats = await prisma.pageView.groupBy({
            by: ['deviceType'],
            _count: {
                id: true
            }
        });

        let mobile = 0;
        let desktop = 0;

        deviceStats.forEach(stat => {
            if (stat.deviceType === 'mobile') {
                mobile = stat._count.id;
            } else if (stat.deviceType === 'desktop') {
                desktop = stat._count.id;
            }
        });

        const total = mobile + desktop;
        const mobilePercentage = total > 0 ? (mobile / total) * 100 : 0;

        return NextResponse.json({
            mobile,
            desktop,
            mobilePercentage: parseFloat(mobilePercentage.toFixed(1))
        });

    } catch (error) {
        console.error('Analytics devices error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch device stats' },
            { status: 500 }
        );
    }
}
