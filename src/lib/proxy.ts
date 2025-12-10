// Global proxy configuration for Node.js HTTP(S) requests
// This helps bypass network/firewall restrictions

import { HttpsProxyAgent } from 'https-proxy-agent';
import type { Agent } from 'http';

let proxyAgent: Agent | undefined;

/**
 * Get configured proxy agent if proxy is set
 */
export function getProxyAgent(): Agent | undefined {
    // Check for proxy environment variables
    const proxyUrl = process.env.HTTPS_PROXY ||
        process.env.HTTP_PROXY ||
        process.env.https_proxy ||
        process.env.http_proxy;

    if (proxyUrl && !proxyAgent) {
        console.log(`[Proxy] Configuring proxy: ${proxyUrl.replace(/\/\/.*@/, '//***@')}`);
        proxyAgent = new HttpsProxyAgent(proxyUrl);
    }

    return proxyAgent;
}

/**
 * Setup global fetch with proxy support (for Node 18+)
 */
export function setupGlobalProxy() {
    const proxy = getProxyAgent();

    if (proxy) {
        console.log('[Proxy] Global proxy configured for application');

        // For google-auth-library and other libraries
        if (typeof global !== 'undefined') {
            (global as any).HTTPS_PROXY = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
        }
    } else {
        console.log('[Proxy] No proxy configured - using direct connection');
    }
}
