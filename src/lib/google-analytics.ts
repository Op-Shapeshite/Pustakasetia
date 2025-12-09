// Google Analytics 4 Integration Service
// Provides methods to send analytics data to GA4 via Measurement Protocol
// Falls back gracefully if credentials are not configured

interface GAEvent {
    name: string;
    params?: Record<string, any>;
}

interface GAPageView {
    page_location: string;
    page_title: string;
    page_referrer?: string;
    device_category?: string;
}

class GoogleAnalyticsService {
    private measurementId: string | undefined;
    private apiSecret: string | undefined;
    private clientEmail: string | undefined;
    private privateKey: string | undefined;
    private enabled: boolean;

    constructor() {
        this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
        this.apiSecret = process.env.GA_API_SECRET;
        this.clientEmail = process.env.GA_CLIENT_EMAIL;
        this.privateKey = process.env.GA_PRIVATE_KEY;

        // Check if GA is properly configured
        this.enabled = !!(this.measurementId && this.apiSecret);
    }

    /**
     * Check if Google Analytics is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Send page view to Google Analytics
     */
    async trackPageView(clientId: string, pageView: GAPageView): Promise<boolean> {
        if (!this.enabled) {
            return false;
        }

        try {
            const payload = {
                client_id: clientId,
                events: [{
                    name: 'page_view',
                    params: {
                        page_location: pageView.page_location,
                        page_title: pageView.page_title,
                        page_referrer: pageView.page_referrer || '(direct)',
                        device_category: pageView.device_category || 'desktop',
                        engagement_time_msec: '100',
                    }
                }]
            };

            const response = await fetch(
                `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                }
            );

            return response.ok;
        } catch (error) {
            console.error('[GA] Error tracking page view:', error);
            return false;
        }
    }

    /**
     * Send custom event to Google Analytics
     */
    async trackEvent(clientId: string, event: GAEvent): Promise<boolean> {
        if (!this.enabled) {
            return false;
        }

        try {
            const payload = {
                client_id: clientId,
                events: [{
                    name: event.name,
                    params: event.params || {}
                }]
            };

            const response = await fetch(
                `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                }
            );

            return response.ok;
        } catch (error) {
            console.error('[GA] Error tracking event:', error);
            return false;
        }
    }

    /**
     * Batch send multiple events to Google Analytics
     */
    async trackBatch(clientId: string, events: GAEvent[]): Promise<boolean> {
        if (!this.enabled || events.length === 0) {
            return false;
        }

        try {
            const payload = {
                client_id: clientId,
                events: events.map(event => ({
                    name: event.name,
                    params: event.params || {}
                }))
            };

            const response = await fetch(
                `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                }
            );

            return response.ok;
        } catch (error) {
            console.error('[GA] Error tracking batch:', error);
            return false;
        }
    }
}

// Export singleton instance
export const gaService = new GoogleAnalyticsService();

// Export types
export type { GAEvent, GAPageView };
