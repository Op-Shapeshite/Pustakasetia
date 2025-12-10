import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { gaService } from '@/lib/google-analytics';

const prisma = new PrismaClient();

// Helper to detect device type from user agent
function getDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// Helper to extract traffic source from referrer
function getTrafficSource(referrer: string | null): string {
    if (!referrer) return 'direct';

    const ref = referrer.toLowerCase();
    if (ref.includes('google')) return 'google';
    if (ref.includes('instagram')) return 'instagram';
    if (ref.includes('tiktok')) return 'tiktok';
    if (ref.includes('facebook')) return 'facebook';

    return 'link';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            page,
            referrer,
            pageTitle,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content
        } = body;

        // Get or create visitor ID from cookie
        const cookieStore = await cookies();
        let visitorId = cookieStore.get('visitor_id')?.value;

        if (!visitorId) {
            visitorId = randomUUID();
            // Note: Setting cookies in API routes requires special handling
            // For now, we'll return the visitor ID to be set on client-side
        }

        const userAgent = request.headers.get('user-agent') || '';
        const deviceType = getDeviceType(userAgent);
        const source = getTrafficSource(referrer);

        // 1. Save to local database
        await prisma.pageView.create({
            data: {
                visitorId,
                page,
                userAgent,
                deviceType,
                referrer: referrer || null
            }
        });

        // 2. Send to Google Analytics (if configured)
        if (gaService.isEnabled()) {
            await gaService.trackPageView(visitorId, {
                page_location: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${page}`,
                page_title: pageTitle || page,
                page_referrer: referrer || undefined,
                device_category: deviceType,
                // Add campaign parameters if present
                campaign_source: utm_source,
                campaign_medium: utm_medium,
                campaign_name: utm_campaign,
                campaign_term: utm_term,
                campaign_content: utm_content,
            });
        });
    }

        // Create or update traffic source
        const existingSource = await prisma.trafficSource.findFirst({
        where: {
            source,
            visitorId
        }
    });

    if (existingSource) {
        await prisma.trafficSource.update({
            where: { id: existingSource.id },
            data: {
                sessions: { increment: 1 }
            }
        });
    } else {
        await prisma.trafficSource.create({
            data: {
                source,
                visitorId,
                sessions: 1,
                bounceRate: Math.random() * 30 + 10, // Placeholder
                avgDuration: Math.floor(Math.random() * 300) + 180 // 3-8 minutes
            }
        });
    }

    return NextResponse.json({
        success: true,
        visitorId
    });

} catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json(
        { error: 'Failed to track analytics' },
        { status: 500 }
    );
}
}
