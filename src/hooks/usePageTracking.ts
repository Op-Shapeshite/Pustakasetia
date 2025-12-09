// Client-side page tracking hook
// Automatically tracks page views and sends to analytics

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
    const pathname = usePathname();
    const previousPath = useRef<string>('');

    useEffect(() => {
        // Skip server-side rendering
        if (typeof window === 'undefined') {
            return;
        }

        // Skip if no pathname or same page
        if (!pathname || pathname === previousPath.current) {
            return;
        }

        previousPath.current = pathname;

        // Get or create visitor ID (with fallback)
        let visitorId: string;
        try {
            visitorId = localStorage.getItem('visitor_id') || '';
            if (!visitorId) {
                visitorId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('visitor_id', visitorId);
            }
        } catch {
            // Fallback if localStorage is not available
            visitorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
                        referrer: document.referrer || '',
                        pageTitle: document.title || pathname,
                    }),
                });

                // Also send to Google Analytics gtag if available
                if ((window as any).gtag) {
                    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
                        page_path: pathname,
                    });
                }
            } catch (error) {
                // Silently fail - analytics should not break the app
            }
        };

        trackPageView();
    }, [pathname]);
}
