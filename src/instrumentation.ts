// Global initialization for Next.js application
// Run this before any other imports to setup global configurations

export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Dynamic import to prevent webpack bundling for client
        const { setupGlobalProxy } = await import('@/lib/proxy');
        setupGlobalProxy();
    }
}
