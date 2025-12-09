import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Try to fetch dynamic product pages
    try {
        const prisma = new PrismaClient();

        const books = await prisma.book.findMany({
            select: {
                id: true,
                updatedAt: true,
            },
        });

        await prisma.$disconnect();

        const productPages: MetadataRoute.Sitemap = books.map((book) => ({
            url: `${baseUrl}/books/${book.id}`,
            lastModified: book.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...productPages];
    } catch (error) {
        console.warn('Sitemap: Unable to fetch books from database, returning static pages only:', error);
        // Return static pages only if DB connection fails during build
        return staticPages;
    }
}
