/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable X-Powered-By header for security
    poweredByHeader: false,

    // Enable compression for better performance
    compress: true,

    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],

    // Externalize server-only packages to prevent webpack bundling issues
    serverExternalPackages: [
        'https-proxy-agent',
        'agent-base',
        'google-auth-library',
        'gaxios',
    ],

    // Image optimization settings
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        // Use modern formats for smaller file sizes
        formats: ['image/avif', 'image/webp'],
        // Optimize image quality (default is 75)
        quality: 80,
        // Define device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        // Define image sizes for srcset
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Minimize layout shift with placeholder
        minimumCacheTTL: 60,
    },

    // Support for asset imports
    webpack: (config, { dev, isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
        };

        // Optimize bundle in production
        if (!dev && !isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all',
                        },
                    },
                },
            };
        }

        return config;
    },
    // Security Headers
    async headers() {
        // Get allowed origin from environment variable or use default
        const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // Content Security Policy - prevents XSS attacks
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com; frame-ancestors 'none';",
                    },
                    // HTTP Strict Transport Security - forces HTTPS
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    // Prevent Adobe Flash and PDF from loading cross-domain content
                    {
                        key: 'X-Permitted-Cross-Domain-Policies',
                        value: 'none',
                    },
                ],
            },
            {
                // CORS for public API endpoints - restricted to specific origin
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: allowedOrigin,
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig
