// Google Analytics Data API Service
// Fetches analytics data directly from Google Analytics

import { GoogleAuth } from 'google-auth-library';

interface GAReportRow {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
}

interface GAReportResponse {
    rows?: GAReportRow[];
    rowCount?: number;
}

class GoogleAnalyticsDataService {
    private propertyId: string | undefined;
    private clientEmail: string | undefined;
    private privateKey: string | undefined;
    private enabled: boolean;
    private auth: GoogleAuth | null = null;

    constructor() {
        this.propertyId = process.env.GA_PROPERTY_ID;
        this.clientEmail = process.env.GA_CLIENT_EMAIL;

        // Handle private key with proper newline conversion
        let privateKey = process.env.GA_PRIVATE_KEY;
        if (privateKey) {
            // Replace literal \n with actual newlines
            privateKey = privateKey.replace(/\\n/g, '\n');
            // Also handle if someone accidentally double-escaped
            privateKey = privateKey.replace(/\\\\n/g, '\n');
        }
        this.privateKey = privateKey;

        this.enabled = !!(this.propertyId && this.clientEmail && this.privateKey);

        if (this.enabled) {
            console.log('[GA Data API] Initialized successfully');
        } else {
            console.log('[GA Data API] Not enabled - missing credentials');
        }
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    private getAuth(): GoogleAuth {
        if (!this.auth) {
            this.auth = new GoogleAuth({
                credentials: {
                    client_email: this.clientEmail,
                    private_key: this.privateKey,
                },
                scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
            });
        }
        return this.auth;
    }

    private async getAccessToken(): Promise<string> {
        const maxRetries = 3;
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[GA Data API] Getting access token... (attempt ${attempt}/${maxRetries})`);

                // Create timeout promise (30 seconds)
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('OAuth request timeout after 30s')), 30000);
                });

                // Race between auth and timeout
                const tokenPromise = (async () => {
                    const auth = this.getAuth();
                    const client = await auth.getClient();
                    const token = await client.getAccessToken();
                    return token.token || '';
                })();

                const accessToken = await Promise.race([tokenPromise, timeoutPromise]);

                console.log('[GA Data API] Access token obtained successfully');
                return accessToken;
            } catch (error: any) {
                lastError = error;
                console.error(`[GA Data API] Token attempt ${attempt} failed:`, error.message);

                // Wait before retry (exponential backoff)
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`[GA Data API] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`Failed to get access token after ${maxRetries} attempts: ${lastError?.message}`);
    }

    /**
     * Run a report on Google Analytics Data API
     */
    async runReport(request: {
        dateRanges: { startDate: string; endDate: string }[];
        dimensions?: { name: string }[];
        metrics: { name: string }[];
        limit?: number;
    }): Promise<GAReportResponse | null> {
        if (!this.enabled) {
            return null;
        }

        try {
            const accessToken = await this.getAccessToken();

            const response = await fetch(
                `https://analyticsdata.googleapis.com/v1beta/${this.propertyId}:runReport`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                }
            );

            if (!response.ok) {
                const error = await response.text();
                console.error('[GA Data API] Error:', error);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('[GA Data API] Request failed:', error);
            return null;
        }
    }

    /**
     * Get total visitors (active users) for a date range
     */
    async getVisitors(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<number> {
        const report = await this.runReport({
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: 'activeUsers' }],
        });

        if (report?.rows?.[0]?.metricValues?.[0]) {
            return parseInt(report.rows[0].metricValues[0].value) || 0;
        }
        return 0;
    }

    /**
     * Get page views for a date range
     */
    async getPageViews(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<number> {
        const report = await this.runReport({
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: 'screenPageViews' }],
        });

        if (report?.rows?.[0]?.metricValues?.[0]) {
            return parseInt(report.rows[0].metricValues[0].value) || 0;
        }
        return 0;
    }

    /**
     * Get sessions for a date range
     */
    async getSessions(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<number> {
        const report = await this.runReport({
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: 'sessions' }],
        });

        if (report?.rows?.[0]?.metricValues?.[0]) {
            return parseInt(report.rows[0].metricValues[0].value) || 0;
        }
        return 0;
    }

    /**
     * Get traffic sources breakdown
     */
    async getTrafficSources(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<{
        source: string;
        sessions: number;
        bounceRate: number;
        avgDuration: number;
    }[]> {
        const report = await this.runReport({
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'sessionSource' }],
            metrics: [
                { name: 'sessions' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' },
            ],
            limit: 10,
        });

        if (!report?.rows) {
            return [];
        }

        return report.rows.map(row => ({
            source: row.dimensionValues?.[0]?.value || 'unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0'),
            bounceRate: parseFloat(row.metricValues?.[1]?.value || '0') * 100,
            avgDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
        }));
    }

    /**
     * Get device category breakdown (mobile vs desktop)
     */
    async getDeviceBreakdown(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<{
        mobile: number;
        desktop: number;
        tablet: number;
    }> {
        const report = await this.runReport({
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'sessions' }],
        });

        const result = { mobile: 0, desktop: 0, tablet: 0 };

        if (report?.rows) {
            for (const row of report.rows) {
                const device = row.dimensionValues?.[0]?.value?.toLowerCase() || '';
                const sessions = parseInt(row.metricValues?.[0]?.value || '0');

                if (device === 'mobile') result.mobile = sessions;
                else if (device === 'desktop') result.desktop = sessions;
                else if (device === 'tablet') result.tablet = sessions;
            }
        }

        return result;
    }

    /**
     * Get comprehensive dashboard stats
     */
    async getDashboardStats(): Promise<{
        visitors: { current: number; previous: number; change: number };
        pageViews: { current: number; previous: number; change: number };
        sessions: { current: number; previous: number; change: number };
    }> {
        // Current period (last 30 days)
        const [currentVisitors, currentPageViews, currentSessions] = await Promise.all([
            this.getVisitors('30daysAgo', 'today'),
            this.getPageViews('30daysAgo', 'today'),
            this.getSessions('30daysAgo', 'today'),
        ]);

        // Previous period (60-30 days ago)
        const [previousVisitors, previousPageViews, previousSessions] = await Promise.all([
            this.getVisitors('60daysAgo', '31daysAgo'),
            this.getPageViews('60daysAgo', '31daysAgo'),
            this.getSessions('60daysAgo', '31daysAgo'),
        ]);

        const calcChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            visitors: {
                current: currentVisitors,
                previous: previousVisitors,
                change: calcChange(currentVisitors, previousVisitors),
            },
            pageViews: {
                current: currentPageViews,
                previous: previousPageViews,
                change: calcChange(currentPageViews, previousPageViews),
            },
            sessions: {
                current: currentSessions,
                previous: previousSessions,
                change: calcChange(currentSessions, previousSessions),
            },
        };
    }
}

// Export singleton instance
export const gaDataService = new GoogleAnalyticsDataService();
