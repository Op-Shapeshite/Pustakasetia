// SEO Component for meta tags
// Provides consistent SEO optimization across pages

import { Metadata } from 'next';

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    noindex?: boolean;
}

export function generateMetadata(props: SEOProps): Metadata {
    const {
        title,
        description,
        keywords = [],
        image = '/img/og-image.png',
        url,
        type = 'website',
        noindex = false
    } = props;

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Pustaka Setia';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    const metadata: Metadata = {
        title: `${title} | ${siteName}`,
        description,
        keywords: keywords.join(', '),

        openGraph: {
            title: `${title} | ${siteName}`,
            description,
            url: fullUrl,
            siteName,
            images: [{
                url: fullImage,
                width: 1200,
                height: 630,
                alt: title,
            }],
            locale: 'id_ID',
            type: type === 'product' ? 'website' : type,
        },

        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${siteName}`,
            description,
            images: [fullImage],
        },

        alternates: {
            canonical: fullUrl,
        },
    };

    if (noindex) {
        metadata.robots = {
            index: false,
            follow: false,
        };
    }

    return metadata;
}

// Helper to generate structured data (JSON-LD)
export function generateStructuredData(type: 'organization' | 'website' | 'product' | 'breadcrumb', data: any) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Pustaka Setia';

    switch (type) {
        case 'organization':
            return {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: siteName,
                url: baseUrl,
                logo: `${baseUrl}/img/logo.png`,
                description: data.description || 'Toko buku online terlengkap',
                address: data.address,
                contactPoint: data.contactPoint,
            };

        case 'website':
            return {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: siteName,
                url: baseUrl,
                description: data.description,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${baseUrl}/products?search={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                }
            };

        case 'product':
            return {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: data.name,
                image: data.image,
                description: data.description,
                brand: {
                    '@type': 'Brand',
                    name: data.author
                },
                offers: {
                    '@type': 'Offer',
                    url: data.url,
                    priceCurrency: 'IDR',
                    price: data.price,
                    availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                }
            };

        case 'breadcrumb':
            return {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: data.items.map((item: any, index: number) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: `${baseUrl}${item.url}`
                }))
            };

        default:
            return null;
    }
}
