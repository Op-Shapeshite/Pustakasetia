// Custom DNS resolver using DNS-over-HTTPS (DoH)
// This bypasses system DNS entirely - no proxy server required

import dns from 'dns';
import https from 'https';
import http from 'http';

// Cache for DNS resolutions (5 minute TTL)
const dnsCache = new Map<string, { ip: string; expires: number }>();
const DNS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
                    const json = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        // Get first A record
                        const aRecord = json.Answer.find((a: any) => a.type === 1);
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
                    const json = JSON.parse(data);
                    if (json.Answer && json.Answer.length > 0) {
                        const aRecord = json.Answer.find((a: any) => a.type === 1);
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
        dns.resolve4(hostname, { ttl: false }, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                resolve(null);
            } else {
                resolve(addresses[0]);
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
    const cached = dnsCache.get(hostname);
    if (cached && cached.expires > Date.now()) {
        return cached.ip;
    }

    console.log(`[Custom DNS] Resolving ${hostname}...`);

    // Try system DNS first
    let ip = await resolveWithSystem(hostname);
    if (ip) {
        console.log(`[Custom DNS] Resolved via system: ${hostname} -> ${ip}`);
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Try Google DoH
    ip = await resolveWithDoH(hostname);
    if (ip) {
        console.log(`[Custom DNS] Resolved via Google DoH: ${hostname} -> ${ip}`);
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Try Cloudflare DoH
    ip = await resolveWithCloudflareDoH(hostname);
    if (ip) {
        console.log(`[Custom DNS] Resolved via Cloudflare DoH: ${hostname} -> ${ip}`);
        dnsCache.set(hostname, { ip, expires: Date.now() + DNS_CACHE_TTL });
        return ip;
    }

    // Use hardcoded fallback for known Google APIs
    const fallback = getFallbackIp(hostname);
    if (fallback) {
        console.log(`[Custom DNS] Using fallback IP: ${hostname} -> ${fallback}`);
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
        console.log('[Custom DNS] Agent initialized with fallback DNS resolution');
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
        } catch (fetchError: any) {
            clearTimeout(timeout);

            // If DNS error, try with resolved IP
            if (
                fetchError.cause?.code === 'EAI_AGAIN' ||
                fetchError.cause?.code === 'ENOTFOUND' ||
                fetchError.message?.includes('getaddrinfo')
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
