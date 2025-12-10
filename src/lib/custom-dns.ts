// Custom DNS resolver using DNS-over-HTTPS (DoH)
// This bypasses system DNS entirely - no proxy server required

import dns from 'dns';
import https from 'https';

// DNS-over-HTTPS response types
interface DnsAnswer {
    name: string;
    type: number;
    TTL: number;
    data: string;
}

interface DnsResponse {
    Status: number;
    Answer?: DnsAnswer[];
}

// Cache for DNS resolutions (5 minute TTL)
const dnsCache = new Map<string, { ip: string; expires: number }>();
const DNS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Store original dns.lookup immediately to prevent recursion
const originalDnsLookup = dns.lookup;

// Known Google API IPs as fallback (updated periodically)
const GOOGLE_API_FALLBACK_IPS: Record<string, string[]> = {
    'oauth2.googleapis.com': ['142.251.12.95', '142.250.4.95', '172.217.14.95'],
    'analyticsdata.googleapis.com': ['142.251.12.95', '142.250.4.95', '172.217.14.95'],
    'www.googleapis.com': ['142.251.12.95', '142.250.4.95', '172.217.14.95'],
};

/**
 * Resolve hostname using Google DNS-over-HTTPS
 */
async function resolveWithDoH(hostname: string): Promise<string | null> {
    return new Promise((resolve) => {
        const url = `https://dns.google/resolve?name=${hostname}&type=A`;

        const req = https.get(url, { timeout: 5000 }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json: DnsResponse = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        // Get first A record (type 1)
                        const aRecord = json.Answer.find((a: DnsAnswer) => a.type === 1);
                        if (aRecord) {
                            resolve(aRecord.data);
                            return;
                        }
                    }
                    resolve(null);
                } catch {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            req.destroy();
            resolve(null);
        });
    });
}

/**
 * Resolve hostname using Cloudflare DNS-over-HTTPS as backup
 */
async function resolveWithCloudflareDoH(hostname: string): Promise<string | null> {
    return new Promise((resolve) => {
        const options = {
            hostname: '1.1.1.1',
            path: `/dns-query?name=${hostname}&type=A`,
            headers: {
                'Accept': 'application/dns-json',
            },
            timeout: 5000,
        };

        const req = https.get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json: DnsResponse = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        // Get first A record (type 1)
                        const aRecord = json.Answer.find((a: DnsAnswer) => a.type === 1);
                        if (aRecord) {
                            resolve(aRecord.data);
                            return;
                        }
                    }
                    resolve(null);
                } catch {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => {
            req.destroy();
            resolve(null);
        });
    });
}

/**
 * Resolve hostname using system DNS
 */
async function resolveWithSystem(hostname: string): Promise<string | null> {
    return new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        originalDnsLookup(hostname, { family: 4 }, (err: NodeJS.ErrnoException | null, address: string) => {
            if (err || !address) {
                resolve(null);
            } else {
                resolve(address);
            }
        });
    });
}

/**
 * Get fallback IP for known Google APIs
 */
function getFallbackIp(hostname: string): string | null {
    const ips = GOOGLE_API_FALLBACK_IPS[hostname];
    if (ips && ips.length > 0) {
        // Rotate through IPs
        return ips[Math.floor(Math.random() * ips.length)];
    }
    return null;
}

/**
 * Resolve hostname with multiple fallback strategies
 */
export async function resolveHostname(hostname: string): Promise<string> {
    // Check cache first
    // Check cache first
    const cached = dnsCache.get(hostname);
    if (cached && cached.expires > Date.now()) {
        return cached.ip;
    }

    // Try system DNS first
    let ip = await resolveWithSystem(hostname);
    if (ip) {
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Try Google DoH
    ip = await resolveWithDoH(hostname);
    if (ip) {
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Try Cloudflare DoH
    ip = await resolveWithCloudflareDoH(hostname);
    if (ip) {
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Use hardcoded fallback for known Google APIs
    const fallback = getFallbackIp(hostname);
    if (fallback) {
        dnsCache.set(hostname, { ip: fallback, expires: Date.now() + DNS_CACHE_TTL });
        return fallback;
    }

    throw new Error(`[Custom DNS] Failed to resolve ${hostname}`);
}

/**
 * Create a custom HTTPS agent that uses our DNS resolver
 */
export function createCustomDnsAgent(): https.Agent {
    return new https.Agent({
        lookup: (hostname, options, callback) => {
            resolveHostname(hostname)
                .then((ip) => {
                    callback(null, ip, 4);
                })
                .catch((err) => {
                    callback(err, '', 4);
                });
        },
        keepAlive: true,
        timeout: 30000,
    });
}

// Singleton agent for reuse
let customAgent: https.Agent | null = null;

export function getCustomDnsAgent(): https.Agent {
    if (!customAgent) {
        customAgent = createCustomDnsAgent();
    }
    return customAgent;
}

/**
 * Custom fetch that uses our DNS resolver (for native fetch in Node 18+)
 */
export async function customFetch(
    url: string | URL,
    init?: RequestInit
): Promise<Response> {
    const urlObj = new URL(url.toString());
    const hostname = urlObj.hostname;

    try {
        // First try normal fetch
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(url, {
                ...init,
                signal: controller.signal,
            });
            clearTimeout(timeout);
            return response;
        } catch (fetchError: unknown) {
            clearTimeout(timeout);

            const error = fetchError as { cause?: { code?: string }; message?: string };

            // If DNS error, try with resolved IP
            if (
                error.cause?.code === 'EAI_AGAIN' ||
                error.cause?.code === 'ENOTFOUND' ||
                error.message?.includes('getaddrinfo')
            ) {
                console.log(`[Custom DNS] Fetch failed with DNS error, using custom resolver for ${hostname}`);

                const ip = await resolveHostname(hostname);

                // Replace hostname with IP in URL
                const newUrl = new URL(url.toString());
                newUrl.hostname = ip;

                // Make request with Host header preserved
                const headers = new Headers(init?.headers);
                headers.set('Host', hostname);

                return fetch(newUrl.toString(), {
                    ...init,
                    headers,
                });
            }

            throw fetchError;
        }
    } catch (error) {
        console.error(`[Custom DNS] Fetch error for ${url}:`, error);
        throw error;
    }
}

let dnsPatched = false;

/**
 * Patch Node.js global dns.lookup to use our custom DNS resolver
 * This affects ALL modules including google-auth-library
 */
export function patchGlobalDns(): void {
    if (dnsPatched) {
        return;
    }

    // Override dns.lookup globally
    (dns as typeof dns & { lookup: typeof dns.lookup }).lookup = function (
        hostname: string,
        options: dns.LookupOptions | number | undefined | null | ((err: NodeJS.ErrnoException | null, address: string, family: number) => void),
        callback?: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
    ): void {
        // Handle different overload signatures
        let opts: dns.LookupOptions = {};
        let cb: (err: NodeJS.ErrnoException | null, address: string, family: number) => void;

        if (typeof options === 'function') {
            cb = options;
        } else if (typeof options === 'number') {
            opts = { family: options };
            cb = callback!;
        } else if (options) {
            opts = options;
            cb = callback!;
        } else {
            cb = callback!;
        }

        // Check if it's a Google API hostname
        const isGoogleApi = hostname.includes('googleapis.com') || hostname.includes('google.com');

        if (isGoogleApi) {
            // Use our custom resolver
            resolveHostname(hostname)
                .then((ip) => {
                    if (opts.all) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (cb as any)(null, [{ address: ip, family: 4 }]);
                    } else {
                        cb(null, ip, 4);
                    }
                })
                .catch((err) => {
                    console.error(`[Custom DNS] Failed to resolve ${hostname}:`, err);
                    // Fallback to original lookup
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    originalDnsLookup(hostname, opts, cb as any);
                });
        } else {
            // Use original lookup for non-Google hostnames
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originalDnsLookup(hostname, opts, cb as any);
        }
    } as typeof dns.lookup;

    dnsPatched = true;
}

/**
 * Initialize custom DNS - call this at app startup
 */
export function initializeCustomDns(): void {
    // Patch global DNS for all modules
    patchGlobalDns();

    // Pre-resolve Google API hostnames
    const hostnames = Object.keys(GOOGLE_API_FALLBACK_IPS);
    hostnames.forEach(async (hostname) => {
        try {
            await resolveHostname(hostname);
        } catch (err) {
            console.error(`[Custom DNS] Failed to pre-resolve ${hostname}:`, err);
        }
    });
}

