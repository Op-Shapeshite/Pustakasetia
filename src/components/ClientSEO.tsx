// Client-side SEO component for 'use client' pages
// Uses react-helmet or Next.js Head for dynamic meta tags

'use client';

import { useEffect } from 'react';

export interface ClientSEOProps {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    noindex?: boolean;
}

export default function ClientSEO(props: ClientSEOProps) {
    const {
        title,
        description,
        keywords = [],
        image = '/img/og-image.png',
        url,
        noindex = false
    } = props;

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Pustaka Setia';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
    const fullTitle = `${title} | ${siteName}`;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords.join(', '));

        // Open Graph
        updateMetaTag('og:title', fullTitle, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:url', fullUrl, 'property');
        updateMetaTag('og:image', fullImage, 'property');
        updateMetaTag('og:site_name', siteName, 'property');
        updateMetaTag('og:locale', 'id_ID', 'property');

        // Twitter
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', fullTitle);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', fullImage);

        // Canonical
        updateLinkTag('canonical', fullUrl);

        // Robots
        if (noindex) {
            updateMetaTag('robots', 'noindex, nofollow');
        } else {
            updateMetaTag('robots', 'index, follow');
        }
    }, [fullTitle, description, keywords, fullUrl, fullImage, siteName, noindex]);

    return null;
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    element.href = href;
}
