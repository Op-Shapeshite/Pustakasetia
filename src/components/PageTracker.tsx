// Automatic page tracker component
'use client';

import { usePageTracking } from '@/hooks/usePageTracking';

export default function PageTracker() {
    usePageTracking();
    return null;
}
