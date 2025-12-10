// Global initialization for Next.js application
// Run this before any other imports to setup global configurations

import { setupGlobalProxy } from '@/lib/proxy';

// Setup proxy configuration (reads from HTTPS_PROXY env var)
setupGlobalProxy();

export { };
