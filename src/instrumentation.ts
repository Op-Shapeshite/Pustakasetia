// Global initialization for Next.js application
// Run this before any other imports to setup global configurations

export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Dynamic import to prevent webpack bundling for client
        const { setupGlobalProxy } = await import('@/lib/proxy');
        setupGlobalProxy();

        // Initialize custom DNS resolver to bypass VPS DNS issues
        const { initializeCustomDns } = await import('@/lib/custom-dns');
        console.log('----------------------------------------');
        console.log('[Instrumentation] Initializing Custom DNS Patch...');
        initializeCustomDns();
        console.log('[Instrumentation] Custom DNS Patch Applied Successfully');
        console.log('----------------------------------------');

        console.log('[Instrumentation] Server initialization complete');
    }
}
