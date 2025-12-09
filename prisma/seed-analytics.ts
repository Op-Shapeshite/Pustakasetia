import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedAnalytics() {
    console.log('🌱 Seeding analytics data...');

    // Generate visitor IDs
    const visitorIds = Array.from({ length: 20 }, () => randomUUID());

    // Create PageViews (30 days worth)
    const devices = ['mobile', 'desktop', 'tablet'];
    const pages = ['/', '/products', '/about', '/contact', '/dashboard'];
    const pageViews = [];

    for (let i = 0; i < 100; i++) {
        const daysAgo = Math.floor(Math.random() * 60); // Last 60 days
        const created = new Date();
        created.setDate(created.getDate() - daysAgo);

        pageViews.push({
            visitorId: visitorIds[Math.floor(Math.random() * visitorIds.length)],
            page: pages[Math.floor(Math.random() * pages.length)],
            deviceType: devices[Math.floor(Math.random() * devices.length)],
            userAgent: 'Mozilla/5.0',
            referrer: null,
            createdAt: created
        });
    }

    await prisma.pageView.createMany({ data: pageViews });
    console.log(`✅ Created ${pageViews.length} page views`);

    // Create Traffic Sources
    const sources = ['google', 'instagram', 'tiktok', 'direct', 'link'];
    const trafficSources = [];

    for (const source of sources) {
        for (let i = 0; i < 10; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const created = new Date();
            created.setDate(created.getDate() - daysAgo);

            trafficSources.push({
                source,
                visitorId: visitorIds[Math.floor(Math.random() * visitorIds.length)],
                sessions: Math.floor(Math.random() * 5) + 1,
                bounceRate: Math.random() * 40 + 10, // 10-50%
                avgDuration: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
                createdAt: created
            });
        }
    }

    await prisma.trafficSource.createMany({ data: trafficSources });
    console.log(`✅ Created ${trafficSources.length} traffic source records`);

    // Create BookSales
    const books = await prisma.book.findMany();
    if (books.length > 0) {
        const bookSales = [];

        for (let i = 0; i < 50; i++) {
            const daysAgo = Math.floor(Math.random() * 60);
            const created = new Date();
            created.setDate(created.getDate() - daysAgo);

            const book = books[Math.floor(Math.random() * books.length)];

            bookSales.push({
                bookId: book.id,
                quantity: Math.floor(Math.random() * 3) + 1,
                totalPrice: book.price * (Math.floor(Math.random() * 3) + 1),
                createdAt: created
            });
        }

        await prisma.bookSale.createMany({ data: bookSales });
        console.log(`✅ Created ${bookSales.length} book sales`);
    }

    console.log('🎉 Analytics seeding completed!');
}

seedAnalytics()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
