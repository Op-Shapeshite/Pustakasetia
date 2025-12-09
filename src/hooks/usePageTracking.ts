// Client-side page tracking hook
// Automatically tracks page views and sends to analytics

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
    const pathname = usePathname();
    const previousPath = useRef<string>('');

    useEffect(() => {
        // Skip if no pathname or same page
        if (!pathname || pathname === previousPath.current) {
            return;
        }

        previousPath.current = pathname;

        // Get or create visitor ID
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('visitor_id', visitorId);
        }

        // Track page view
        const trackPageView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: pathname,
                        referrer: document.referrer,
                        pageTitle: document.title,
                    }),
                });

                // Also send to Google Analytics gtag if available
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
                        page_path: pathname,
                    });
                }
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        trackPageView();
    }, [pathname]);
}
